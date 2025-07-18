import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};



const verifyToken = (authHeader) => {
    const AccessToken = authHeader.split(" ")[1];
    return jwt.verify(AccessToken, process.env.JWT_SECRET);
};


const refreshToken = (id, clientIP) => {
  return jwt.sign({ id, clientIP }, process.env.JWT_REFRESH_SECRET, { expiresIn: "1d" });
}


const verifyRefreshToken = (refreshTokenCookie, clientIP) => {

    const decoded = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH_SECRET);
    
    if (decoded.clientIP !== clientIP) {
        throw new Error("Invalid refresh token - IP mismatch");
    }
    
    return decoded;
};



export { createToken, refreshToken, verifyToken, verifyRefreshToken };
