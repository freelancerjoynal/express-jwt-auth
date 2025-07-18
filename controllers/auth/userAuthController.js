import userModel from "../../models/userModel.js";
import validator from "validator";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createToken,
  refreshToken,
  verifyRefreshToken,
  verifyToken,
} from "../../utils/jwtTokens.js";
import {
  setAccessCookie,
  setRefreshCookie,
  clearAuthCookies,
} from "../../utils/cookies.js";

const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Checking if user already exists
    const exists = await userModel.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "User already exits" });

    // Validating email and password
    if (!validator.isEmail(email))
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    if (password.length < 8)
      return res.json({
        success: false,
        message: "Please choose a strong password",
      });

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

    res.json({
      success: true,
      message: "User registered sucessfully",
      accessToken: token,
      refreshToken: refresh,
    });
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

    const refresh = refreshToken(exists._id, clientIP);
    exists.refreshToken = refresh;
    await exists.save();

    res.json({
      success: true,
      message: "Login successful",
      data: {
        _id: exists._id,
        name: exists.name,
        email: exists.email,
      },
      accessToken: token,
      refreshToken: refresh,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const refreshTokenValidate = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const oldRefreshToken = authHeader && authHeader.split(" ")[1]; // Renamed to oldRefreshToken

    const clientIP = req.clientIp;
    const refreshTokenVerify = verifyRefreshToken(oldRefreshToken, clientIP);
    if (!refreshTokenVerify) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const user = await userModel.findById(refreshTokenVerify.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    if (user.refreshToken !== oldRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = createToken(refreshTokenVerify.id);

    res.json({
      success: true,
      message: "Refresh token was valid, new access token was generated",
      accessToken: newAccessToken,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid refresh token",
    });
  }
};

const userLogout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated, please login",
      });
    }

    const varifyToken = verifyToken(authHeader);
    if (!varifyToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await userModel.findById(varifyToken.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    user.refreshToken = "null";
    await user.save();

    // Destroy access token by sending null
    res.setHeader("Authorization", "null");

    // Destroy refresh token by sending null
    res.setHeader("Refresh-Token", "null");

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update the export statement
export { userRegister, userLogin, refreshTokenValidate, userLogout };
