import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10m" });
};

const verifyToken = (authHeader) => {
    const AccessToken = authHeader.split(" ")[1];
    return jwt.verify(AccessToken, process.env.JWT_SECRET);
};

export { createToken, verifyToken };
