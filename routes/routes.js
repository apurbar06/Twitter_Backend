const { Router } = require("express");
const Controller = require("../controllers/controller");
const authentication = require("../middleware/authentication");
const Validation = require("../middleware/validator");
const route = Router();

route.post(
  "/signup",
  Validation.signUp,
  Validation.validator,
  Controller.signUp
);

route.post("/login", Validation.login, Validation.validator, Controller.login);

route.post(
  "/follow",
  authentication.verifyToken,
  Validation.follow,
  Validation.validator,
  Controller.followUser
);

route.post(
  "/tweets",
  authentication.verifyToken,
  Validation.tweet,
  Validation.validator,
  Controller.tweet
);

route.get("/tweets", authentication.verifyToken, Controller.getTweets);

route.get("/me", authentication.verifyToken, Controller.getMe);

route.get("/users", authentication.verifyToken, Controller.getUsers);

route.get("/following", authentication.verifyToken, Controller.getFollowing);

route.get("/followers", authentication.verifyToken, Controller.getFollowers);

module.exports = route;
