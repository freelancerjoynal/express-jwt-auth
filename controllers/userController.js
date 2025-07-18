import userModel from "../models/userModel.js";
import validator from "validator";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { createToken, refreshToken } from "../utils/jwtTokens.js";


const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Checking if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) res.json({ success: false, message: "User already exits" });

    // Validating email and password
    if (!validator.isEmail(email))
      res.json({ success: false, message: "Please enter a valid email" });
    if (password.length < 8)
      res.json({ success: false, message: "Please choose a strong password" });

    // Hashing password before store
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const clientIP = req.clientIp;

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const refresh = refreshToken(user._id, clientIP);
    user.refreshToken = refresh;
    await user.save();

    // res.json({ success: true, message: "User registered sucessfully" })
    const token = createToken(user._id);

    res.json({ success: true, message: "User registered sucessfully", token, refresh });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validating email and password
    if (!validator.isEmail(email))
      res.json({ success: false, message: "Please enter a valid email" });

    //Checking if user already exists
    const exists = await userModel.findOne({ email });
    if (!exists) res.json({ success: false, message: "User does not exits" });

    // Compare password with hashed password
    const match = await bycrypt.compare(password, exists.password);
    if (!match) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Generate JWT token
    const token = createToken(exists._id);
    const clientIP = req.clientIp;

    res.json({
      success: true,
      message: "Login successful",
      data: exists,
      token,
      clientIP,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const userData = async (req, res) => {
  try {
    const tokenuser = res.locals.tokenuser;
    const userData = await userModel.findById(tokenuser.id);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      data: { _id: userData._id, name: userData.name, email: userData.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { userRegister, userLogin, userData };
