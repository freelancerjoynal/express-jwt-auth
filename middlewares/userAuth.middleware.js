import jwt from "jsonwebtoken";

const userAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated, please login"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 👉 Respond with decoded info
        return res.status(200).json({
            success: true,
            message: "Token decoded successfully",
            user: decoded
        });

        // If you still want to go to next middleware instead:
        // req.user = decoded;
        // next();

    } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
};

export default userAuthMiddleware;
