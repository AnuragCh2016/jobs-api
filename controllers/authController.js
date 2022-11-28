import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import errors from "../errors/index.js";

export class AuthController {
  static registerUser = async (req, res) => {
    /* const {name,email,password} = req.body;
    if(!(name && email && password)){
        throw new errors.BadRequestError(`All fields required`);
    }
    const salt = await bcrypt.genSalt(12);
    const user = new User({
        name,
        email,
        password: await bcrypt.hash(password,salt),
    })
    const result = await user.save(); */

    //all middleware logic shifted to mongoose User model
    const user = await User.create({ ...req.body });
    const token = user.generateToken(); //mongoose instance method can be added for certain functionalities for all instances of a model
    res
      .status(StatusCodes.CREATED)
      .json({ msg: "Success! Registered", token: token });
  };

  static loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!(email && password))
      throw new errors.BadRequestError(`Both email and password required`);
    const user = await User.findOne({ email: email });
    // console.log(user==null);
    if (!user) {
      throw new errors.UnauthenticatedError(`Unauthorized error`);
    }
    const passwordCheck = user.comparePasswords(password);
    if (!passwordCheck) {
      throw new errors.UnauthenticatedError(`Unauthorized error`);
    }
    const token = user.generateToken();
    res.status(StatusCodes.OK).json({ msg: "Logged in", token: token });
    /* const {authorization} = req.headers;
        if(!authorization || !authorization.startsWith('Bearer ')){
            throw new errors.BadRequestError('No token present');
        } else {
            const token = authorization.split(' ')[1];

        } */
  };
}
