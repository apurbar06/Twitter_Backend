const JWT = require("jsonwebtoken");
const { sendError } = require("../utils/utils");

exports.createToken = async (userCode, userName) => {
  try {
    const token = JWT.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
        data: {
          userCode: userCode,
          userName: userName,
        },
      },
      process.env.SECRET
    );
    return token;
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.send({
        statusCode: 401,
        error: "Please provide authorization token",
      });
    }

    var decoded = JWT.verify(
      req.headers.authorization.split(" ")[1],
      process.env.SECRET
    );
    req.payload = decoded.data;
    next();
  } catch (error) {
    if (error instanceof JWT.TokenExpiredError) {
      return sendError(res, 401, "Token expired");
    } else {
      return sendError(res, 500, "Token verification failed");
    }
  }
};
