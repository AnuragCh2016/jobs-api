import mongoose from "mongoose";
import { jobSchema } from "./Job.js";
import bcrypt from "bcryptjs";
const { Schema } = mongoose;
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "email must be in form of xxxx@yyyy.zzz",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: 4,
  },
  jobs: [jobSchema],
});

//dont put arrow function which does not have an associated 'this'
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, name:this.name }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

userSchema.methods.comparePasswords = async function (password) {
    const check = bcrypt.compare(password, this.password);
    return check;
}


export const User = mongoose.model("User", userSchema);
