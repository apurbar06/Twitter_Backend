const { query, body, check, validationResult } = require("express-validator");
const { sendError } = require("../utils/utils");

exports.signUp = [
  check("userName").notEmpty().withMessage("userName required"),
  check("email").notEmpty().withMessage("Email is required"),
  check("password").notEmpty().withMessage("password is required"),
];

exports.login = [
  check("email").notEmpty().withMessage("Email is required"),
  check("password").notEmpty().withMessage("password is required"),
];

exports.follow = [
  check("followinguserCode")
    .notEmpty()
    .withMessage("following userCode is required"),
];

exports.tweet = [
  check("tweet")
    .not()
    .isEmpty()
    .withMessage("message cannot be empty")
    .bail()
    .custom((value, { req }) => {
      // You can check if the field is missing here
      if (!req.body.tweet) {
        throw new Error("message is required");
      }
      return true;
    }),
];

exports.validator = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, "Vaildation Failed", {
        errors: validationResult(req)
          .array()
          .map((e) => e.msg),
        location: errors.errors[0].location,
      });
    } else {
      next();
    }
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
