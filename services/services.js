const User = require("../models/userModel");
const Message = require("../models/userMessages");
const Follow = require("../models/follwerFollowingUser");
const authentication = require("../middleware/authentication");
const bcrypt = require("bcrypt");
const { sendError, sendSuccess } = require("../utils/utils");

exports.signUp = async (res, userName, password, email) => {
  try {
    const userExist = await User.findOne({
      email,
    });

    if (userExist) {
      return sendError(res, 409, "User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const data = await User.create({
      userName: userName,
      password: hashedPassword,
      salt: salt,
      email: email,
    });

    const token = await authentication.createToken(
      data.userCode,
      data.userName
    );

    return sendSuccess(res, 200, "User signup successfully", {
      userCode: data.userCode,
      token: token,
    });
  } catch (error) {
    // console.log(`Error at signUp process...............`, error.message);
    if (error instanceof Error && error.code === 11000) {
      console.error("Duplicate key error:", error.message);
      const regex = /\{([^}]+)\}/g;
      const matches = error.message.match(regex);
      return sendError(res, 409, "Duplicate key error:" + " " + matches);
    } else {
      console.error("MongoDB Error:", error.message);
      return sendError(
        res,
        500,
        "An error occurred while performing the operation."
      );
    }
  }
};

exports.login = async (res, password, email) => {
  try {
    const userExistWithEmail = await User.findOne(
      { email },
      { userName: 1, userCode: 1, salt: 1, _id: 0 }
    );
    if (!userExistWithEmail) {
      return sendError(res, 300, "User with this email not found");
    }

    const salt = userExistWithEmail.salt;
    const hashedPassword = await bcrypt.hash(password, salt);
    const userExistWithEmailAndPassword = await User.findOne(
      { password: hashedPassword, email },
      { userName: 1, userCode: 1, _id: 0 }
    );
    if (!userExistWithEmailAndPassword) {
      return sendError(res, 300, "User with this email and password not found");
    } else {
      const token = await authentication.createToken(
        userExistWithEmailAndPassword.userCode,
        userExistWithEmailAndPassword.userName
      );
      return sendSuccess(res, 200, "User logged successfully", {
        userId: userExistWithEmailAndPassword.userCode,
        token: token,
      });
    }
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.followUser = async (res, followinguserCode, followerUserode) => {
  try {
    const userExist = await User.findOne(
      { userCode: followinguserCode },
      { userName: 1, userCode: 1, _id: 0 }
    );
    if (!userExist) {
      return sendError(res, 300, "User not found");
    } else {
      const followCheck = await Follow.findOne({
        followingUserCode: followinguserCode,
        followerUserCode: followerUserode,
      });
      if (followCheck) {
        return sendSuccess(res, 200, "Already following");
      }
      let followerFollowingObj = {
        followerUserCode: followerUserode,
        followingUserCode: followinguserCode,
      };
      await User.updateOne(
        { userCode: followerUserode },
        { $inc: { followingCount: 1 } }
      );
      await User.updateOne(
        { userCode: followinguserCode },
        { $inc: { followerCount: 1 } }
      );

      await Follow.create(followerFollowingObj);
      return sendSuccess(res, 200, "User follwed successfully");
    }
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.tweet = async (res, userCode, tweet) => {
  try {
    const data = await Message.create({ userCode, message: tweet });
    return sendSuccess(res, 200, "Tweet uploaded successfully", {
      tweet: data.message,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.getTweets = async (res, userCode) => {
  try {
    let data = await User.aggregate([
      {
        $match: {
          userCode: userCode,
        },
      },
      {
        $lookup: {
          from: "followerfollowingusers",
          let: {
            followerUserCode: "$userCode",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$followerUserCode", "$$followerUserCode"],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$_id",
                followingUserCodes: {
                  $push: "$followingUserCode",
                },
              },
            },
          ],
          as: "codes",
        },
      },
      {
        $unwind: {
          path: "$codes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          followingUserCodes: {
            $cond: {
              if: {
                $isArray: "$codes.followingUserCodes",
              },
              then: {
                $concatArrays: ["$codes.followingUserCodes", ["$userCode"]],
              },
              else: ["$userCode"],
              // If existingArray is not an array or doesn't exist, provide a new array with the ID
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userCodes: "$followingUserCodes",
        },
      },
      {
        $lookup: {
          from: "messages",
          let: {
            userCodes: "$userCodes",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: {
                    $in: ["$userCode", "$$userCodes"],
                  },
                },
              },
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "userCode",
                foreignField: "userCode",
                as: "userDetails",
              },
            },
            {
              $unwind: {
                path: "$userDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                message: 1,
                userCode: 1,
                messageCode: 1,
                userName: "$userDetails.userName",
                createdAt: 1,
              },
            },
          ],
          as: "tweets",
        },
      },
      {
        $project: {
          tweets: "$tweets",
          copies_sold: "$copies_sold",
        },
      },
    ]);

    return sendSuccess(res, 200, "", {
      tweets: data.length ? data[0].tweets : [],
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.getUsers = async (res, userCode) => {
  try {
    let data = await User.aggregate([
      {
        $lookup: {
          from: "followerfollowingusers",
          localField: "userCode",
          foreignField: "followingUserCode",
          as: "folowwingUsers",
        },
      },
      {
        $project: {
          _id: 0,
          userName: 1,
          userCode: 1,
          isFollowing: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$folowwingUsers",
                        as: "user",
                        cond: {
                          $eq: ["$$user.followerUserCode", userCode],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
    ]);

    return sendSuccess(res, 200, "", {
      users: data.length ? data : [],
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};



exports.getMe = async (res, userCode) => {
  try {
    let data = await User.findOne({userCode: userCode})

    return sendSuccess(res, 200, "", {
      user: data,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};



exports.getFollowing = async (res, userCode) => {
  try {
    let data = await User.aggregate([
      {
        $lookup: {
          from: "followerfollowingusers",
          localField: "userCode",
          foreignField: "followingUserCode",
          as: "followingUsers",
        },
      },
      {
        $match: {
          "followingUsers.followerUserCode": userCode
        }
      },
      {
        $project: {
          _id: 0,
          userName: 1,
          userCode: 1,
          isFollowing: { $literal: true },
        },
      },
    ]);

    return sendSuccess(res, 200, "", {
      users: data.length ? data : [],
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};








exports.getFollowers = async (res, userCode) => {
  try {
    let data = await User.aggregate([
      {
        $lookup: {
          from: "followerfollowingusers",
          localField: "userCode",
          foreignField: "followerUserCode",
          as: "followedUsers",
        },
      },
      {
        $match: {
          "followedUsers.followingUserCode": userCode
        }
      },
      {
        $project: {
          _id: 0,
          userName: 1,
          userCode: 1,
          isFollowing: { $literal: true },
        },
      },
    ]);

    return sendSuccess(res, 200, "", {
      users: data.length ? data : [],
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

