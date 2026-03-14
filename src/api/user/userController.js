import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import userModel from "./userModel";
import { config } from "../config/config";

const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }
  try {
    const UserExist = await userModel.findOne({ email });
    if (UserExist) {
      return createHttpError(400, "User already exist login now");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ sub: newUser }, config.jwtsecret, {
      expiresIn: "30d",
    });

    res.status(200, {
      message: "user registered successfully",
      accessToken: token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return next(createHttpError(500, "error while registering user"));
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createHttpError(400, "login error"));
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return next(createHttpError(404, "password not match"));
    }

    const token = jwt.sign({ sub: user._id }, config.jwtSecret, {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "Login successful",
      accessToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return next(createHttpError(500, "Error while logging in"));
  }
};


export {registerUser,loginUser};