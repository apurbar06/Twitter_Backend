const Services = require("../services/services");
const { sendError } = require("../utils/utils");

exports.signUp = async (req, res) => {
  try {
    const { userName, password, email } = req.body;
    const response = await Services.signUp(res, userName, password, email);
    return response;
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { password, email } = req.body;
    const response = await Services.login(res, password, email);
    return response;
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.followUser = async (req, res) => {
  try {
    const { followinguserCode } = req.body;
    const { userCode } = req.payload;

    const response = await Services.followUser(
      res,
      followinguserCode,
      userCode
    );
    return response;
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.tweet = async (req, res) => {
  try {
    const { userCode } = req.payload;
    const { tweet } = req.body;
    const response = await Services.tweet(res, userCode, tweet);
    return response;
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.getTweets = async (req, res) => {
  try {
    const { userCode } = req.payload;
    const response = await Services.getTweets(res, userCode);
    return response;
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};


exports.getUsers = async (req, res) => {
  try {
    const { userCode } = req.payload;
    const response = await Services.getUsers(res, userCode);
    return response;
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.getMe = async (req, res) => {
  try {
    const { userCode } = req.payload;
    const response = await Services.getMe(res, userCode);
    return response;
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};


exports.getFollowing = async (req, res) => {
  try {
    const { userCode } = req.payload;
    const response = await Services.getFollowing(res, userCode);
    return response;
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};


exports.getFollowers = async (req, res) => {
  try {
    const { userCode } = req.payload;
    const response = await Services.getFollowers(res, userCode);
    return response;
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
