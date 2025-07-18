import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10m" });
};



const verifyToken = (authHeader) => {
    const AccessToken = authHeader.split(" ")[1];
    return jwt.verify(AccessToken, process.env.JWT_SECRET);
};


const refreshToken = (id, clientIP) => {
  return jwt.sign({ id, clientIP }, process.env.JWT_REFRESH_SECRET, { expiresIn: "1d" });
}


const verifyRefreshToken = (authHeader, clientIP) => {
  const RefreshToken = authHeader.split(" ")[1];
  return jwt.verify(RefreshToken, process.env.JWT_REFRESH_SECRET);
}

export { createToken, refreshToken, verifyToken, verifyRefreshToken };
