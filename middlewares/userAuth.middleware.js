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
    const decodedToken = verifyToken(authHeader);
    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.tokenuser = decodedToken;
    // Make verified token available for subsequent responses
    res.locals.tokenuser = decodedToken;
    next();


    
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

export default userAuthMiddleware;
