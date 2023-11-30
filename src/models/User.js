import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import * as dotenv from "dotenv";
dotenv.config();

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: [true, "Email already exist"],
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Please enter your Password"],
    minLength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  avatar: {
    public_id: String,
    url: String,
  },
//   confirmPassword: {
//     type: String,
//     required: [true, 'Please confirm your password.']
// },
  otp:Number,
  otp_expire:Date
//   passwordResetToken: String,
//   passwordResetTokenExpires: Date,
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.comparePassword = async function (candidatePassword) {
  const user = this;
  const match = await bcrypt.compare(candidatePassword, user.password);
  return match;
};

schema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

//Instance method
schema.methods.createPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 15 * 60 * 1000;
  console.log(resetToken, this.passwordResetToken);
  return resetToken;
};

export const User = mongoose.model("User", schema);
