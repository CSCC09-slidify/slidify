import { Router } from "express";
import { validateUserCredentials } from "../middleware/auth.js";
import { Notification } from "../models/notification.js";

export const notificationsRouter = Router();

notificationsRouter.get("/active", validateUserCredentials, async (req, res) => {
    const { userId } = req.session;
    const notifications = await Notification.findAll({
        where: {
            actorId: userId,
            status: 1
        },
        order: [["createdAt", "DESC"]]
    })
    return res.json({
        notifications: notifications.map(n => ({
            type: n.type,
            content: n.content,
            date: n.createdAt
        })), 
        totalCount: notifications.length
    });
})

notificationsRouter.post("/readAll", validateUserCredentials, async (req, res) => {
    const { userId } = req.session;
    await Notification.update(
        { status: 0 },
        {
            where: {
                actorId: userId,
                status: 1
            }
        }
    )
    return res.json({message: "Successfully marked as read"});
})
