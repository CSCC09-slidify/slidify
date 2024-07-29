import { Router } from "express";
import multer from "multer";
import {
  convertVideoToSlides,
  convertTextToSlides,
  continueVideoToSlidesAfterCallback
} from "../tools/videoToSlides.js";
import { Presentation } from "../models/presentation.js";
import {
  validateUserCredentials,
  validateNoActiveJobs,
} from "../middleware/auth.js";
import { User } from "../models/user.js";
import { Job } from "../models/job.js";
import { Notification } from "../models/notification.js";
import slidesApi from "../tools/slides/api.js";
import { sendNotification } from "../tools/notifications.js";
import { UserSettings } from "../models/userSettings.js";
import { defaultUserSettings } from "../constants/userSettings.js";
import crypto from "crypto";

const upload = multer();

export const slidesRouter = Router();

slidesRouter.post(
  "/fromVideo",
  validateUserCredentials,
  validateNoActiveJobs,
  upload.single("file"),
  async (req, res) => {
    const file = req.file;
    const { title } = req.query;
    const { userId } = req.session;
    const userSettings = await UserSettings.findOne({
      where: {
        UserUserId: userId
      }
    })
    // TODO: store jobs and generate IDs elsewhere
    const jobId = crypto.randomUUID();
    const job = await Job.create({
      jid: jobId,
      status: "running",
      startedAt: new Date(),
      UserUserId: userId,
      title,
    });
    convertVideoToSlides(
      {
        filePath: file.path,
        fileBuffer: file.buffer,
        fileName: file.filename,
        title,
        slidesOAuthToken: req.session.accessToken,
        config: userSettings.config,
        callbackUrl: process.env.NODE_ENV == "production" || process.env.SPEECHMATICS_CALLBACK_URL ? 
        `${process.env.SPEECHMATICS_CALLBACK_URL}/${jobId}?title=${title}&accessToken=${req.session.accessToken}` : null
      },
      (statusMessage, presentationId) => {
        req.io.emit(`slides/${jobId}/status`, {statusMessage, presentationId});
      },
      (presentationId) => {
        req.io.emit(`slides/${jobId}/presentationId`, presentationId);
      },
      (slideId, presentationId) => {
        req.io.emit(`slides/${jobId}/slideReady`, {slideId, presentationId});
      },
      (slideId, script) => {
        req.io.emit(`slides/${jobId}/scriptReady`, { slideId, script });
      },
      async (r) => {
        try {
          const user = await User.findOne({
            where: {
              userId: req.session.userId
            }
          })
          if (!user) {
            return;
          }
          if (!r.error) {
            const { presentationId } = r;
            console.log("creating presentation", jobId, presentationId);
            await Presentation.create({
              presentationId: jobId,
              externalId: presentationId,
              title,
              UserUserId: req.session.userId,
              SlidifyPresentationJobJid: jobId,
            });
            job.status = "done";
            const notification = await Notification.create({
              notificationId: `${userId}#${Date.now().toString()}${Math.floor(Math.random() * 10000)}`,
              actorId: userId,
              type: "presentation",
              content: {
                title: `Presentation "${title}" has been created.`,
                presentationId: jobId,
              },
              status: 1,
            });
            sendNotification(userId, req.io, notification);
          } else {
            job.status = "error";
          }
          job.finishedAt = new Date();
          await job.save();
          req.io.emit(`slides/${jobId}/done`, r);
        } catch (e) {
          job.status = "error";
          await job.save();
          req.io.emit(`slides/${jobId}/done`, {
            error: "There was a problem creating the presentation"
          });
        }
      },
    );
    return res.json({ msg: "Job started", id: jobId });
  },
);

slidesRouter.post(
  "/fromText",
  validateUserCredentials,
  validateNoActiveJobs,
  async (req, res) => {
    const { text } = req.body;
    const { title } = req.query;
    const { userId } = req.session;
    const userSettings = await UserSettings.findOne({
      where: {
        UserUserId: userId
      }
    })
    // TODO: store jobs and generate IDs elsewhere
    const jobId = crypto.randomUUID();
    const job = await Job.create({
      jid: jobId,
      status: "running",
      startedAt: new Date(),
      UserUserId: userId,
      title,
    });
    convertTextToSlides(
      {
        text,
        title,
        slidesOAuthToken: req.session.accessToken,
        config: userSettings.config,
      },
      (statusMessage, presentationId) => {
        req.io.emit(`slides/${jobId}/status`, {statusMessage, presentationId});
      },
      (presentationId) => {
        req.io.emit(`slides/${jobId}/presentationId`, presentationId);
      },
      (slideId, presentationId) => {
        req.io.emit(`slides/${jobId}/slideReady`, {slideId, presentationId});
      },
      (slideId, script) => {
        req.io.emit(`slides/${jobId}/scriptReady`, { slideId, script });
      },
      async (r) => {
        try {
          const user = await User.findOne({
            where: {
              userId: req.session.userId
            }
          })
          if (!user) {
            return;
          }
          if (!r.error) {
            const { presentationId } = r;
            await Presentation.create({
              presentationId: jobId,
              externalId: presentationId,
              UserUserId: req.session.userId,
              SlidifyPresentationJobJid: jobId,
              title,
            });
            job.status = "done";
            const notification = await Notification.create({
              notificationId: `${userId}#${Date.now().toString()}${Math.floor(Math.random() * 10000)}`,
              actorId: userId,
              type: "presentation",
              content: {
                title: `Presentation "${title}" has been created.`,
                presentationId: jobId,
              },
              status: 1,
            });
            sendNotification(userId, req.io, notification);
            job.finishedAt = new Date();
          } else {
            job.status = "error";
          }
          job.finishedAt = new Date();
          await job.save();
          req.io.emit(`slides/${jobId}/done`, r);
        } catch (e) {
          job.status = "error";
          await job.save();
          req.io.emit(`slides/${jobId}/done`, {
            error: "There was a problem creating the presentation"
          });
        }
      },
    );
    return res.json({ msg: "Job started", id: jobId });
  },
);

slidesRouter.post("/callback/:jobId", async (req, res) => {
  const { jobId } = req.params;
  const { id, status, title, accessToken } = req.query;

  const job = await Job.findOne({
    where: {
      jid: jobId
    }
  })
  req.io.emit(`slides/${jobId}/status`, { statusMessage: "Received callback" });

  if (!job) return res.json({message: "Job does not exist"})
  const userId = job.UserUserId;
  const userSettings = await UserSettings.findOne({
    where: {
      UserUserId: job.UserUserId
    }
  })
  if (status == "success") {
    continueVideoToSlidesAfterCallback({
        title,
        slidesOAuthToken: accessToken,
        config: userSettings.config ?? defaultUserSettings,
        speechmaticsJobId: id
      },
      (statusMessage, presentationId) => {
        req.io.emit(`slides/${jobId}/status`, { statusMessage, presentationId });
      },
      (presentationId) => {
        req.io.emit(`slides/${jobId}/presentationId`, presentationId);
      },
      (slideId) => {
        req.io.emit(`slides/${jobId}/slideReady`, slideId);
      },
      (slideId, script) => {
        req.io.emit(`slides/${jobId}/scriptReady`, { slideId, script });
      },
      async (r) => {
        try {
          if (!r.error) {
            const { presentationId } = r;
            await Presentation.create({
              presentationId: jobId,
              externalId: presentationId,
              title,
              UserUserId: userId,
              SlidifyPresentationJobJid: jobId,
            });
            job.status = "done";
            const notification = await Notification.create({
              notificationId: `${userId}#${Date.now().toString()}${Math.floor(Math.random() * 10000)}`,
              actorId: userId,
              type: "presentation",
              content: {
                title: `Presentation "${title}" has been created.`,
                presentationId: jobId,
              },
              status: 1,
            });
            sendNotification(userId, req.io, notification);
          } else {
            job.status = "error";
          }
          job.finishedAt = new Date();
          await job.save();
          req.io.emit(`slides/${jobId}/done`, r);
        } catch (e) {
          job.status = "error";
          await job.save();
          req.io.emit(`slides/${jobId}/done`, {
            error: "There was a problem creating the presentation"
          });
        }
      },
    )
  }
  res.json({ message: "Received callback" })
})

slidesRouter.get("/", validateUserCredentials, async (req, res) => {
  try {
    const userId = req.session.userId;
    const presentations = await Presentation.findAll({
      where: {
        UserUserId: userId,
      },
    });
    const fetchSlides = presentations.map((p) =>
      slidesApi
        .getPresentationSlideIds(req.session.accessToken, p.externalId)
        .then((slideIds) => ({
          title: p.title,
          presentationId: p.presentationId,
          externalId: p.externalId,
          slideIds,
          createdAt: p.createdAt,
        })),
    );
    Promise.all(fetchSlides).then((presentationsWithSlideIds) =>
      res.json({
        presentations: presentationsWithSlideIds,
        totalCount: presentations.length,
      }),
    );
  } catch (e) {
    res.status(500).json(e);
  }
});

slidesRouter.get(
  "/:presentationId",
  validateUserCredentials,
  async (req, res) => {
    const userId = req.session.userId;
    const presentation = await Presentation.findOne({
      where: {
        UserUserId: userId,
        presentationId: req.params.presentationId,
      },
      include: [
        {
          model: Job,
        },
      ],
    });
    if (!presentation) {
      return res.status(404).json({ error: "Presentation not found" });
    }
    slidesApi
      .getPresentationSlideIds(req.session.accessToken, presentation.externalId)
      .then(async (slideIds) => {
        const slideScripts = {};
        for (let i = 0; i < slideIds.length; i++) {
          const id = slideIds[i];
          const text = await slidesApi.getSlideSpeakerNotesText(
            req.session.accessToken,
            presentation.externalId,
            id,
          );
          slideScripts[id] = text;
        }
        res.json({
          title: presentation.title,
          presentationId: presentation.presentationId,
          externalId: presentation.externalId,
          slideIds,
          slideScripts,
          createdAt: presentation.createdAt,
          status: presentation.SlidifyPresentationJob.status,
          jobStarted: presentation.SlidifyPresentationJob.startedAt,
          jobFinished: presentation.SlidifyPresentationJob.finishedAt,
        });
      });
  },
);

slidesRouter.get("/jobs/active", validateUserCredentials, async (req, res) => {
  const userId = req.session.userId;
  const activeJobs = await Job.findAndCountAll({
    where: {
      UserUserId: userId,
      status: "running",
    },
  });
  return res.json({ jobs: activeJobs.rows, total: activeJobs.count });
});

// For debugging
slidesRouter.get("/jobs/deleteAllRunning", async (req, res) => {
  await Job.destroy({
    where: {
      status: "running",
    },
  });
  return res.status(204).json({ message: "Deleted" });
});
