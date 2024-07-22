import { User } from "../models/user.js";
import { Job } from "../models/job.js";

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

export const validateNoActiveJobs = async (req, res, next) => {
  validateUserCredentials(req, res, async () => {
    const jobs = await Job.count({
      where: {
        UserUserId: req.session.userId,
        status: "running"
      }
    });
    if (jobs !== 0) {
      return res.status(403).json({error: "You already have an active job running"})
    }
    next();
  })
}