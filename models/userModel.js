const mongoose = require("mongoose");
const uuid = require("uuid");

const UserSchema = new mongoose.Schema(
  {
    userCode: {
      type: String,
      unique: true,
      default: function genUUID() {
        return uuid.v1();
      },
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    salt: { type: String, required: true },

    followerCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
