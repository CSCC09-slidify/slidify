import { User } from "../models/user.js";

export const validateUserCredentials = async (req, res, next) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({message: "Invalid credentials"});
    }
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      return res.status(401).json({
        error: "User not authenticated: " + req.session.userId,
      });
    }
    next();
}