import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwtTokens.js";

const userAuthMiddleware = async (req, res, next) => {
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

    req.tokenuser = varifyToken;
    // Make verified token available for subsequent responses
    res.locals.tokenuser = varifyToken;
    // res.json({
    //   success: true,
    //   message: "User authenticated successfully",
    //   user: varifyToken
    // });
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

export default userAuthMiddleware;
