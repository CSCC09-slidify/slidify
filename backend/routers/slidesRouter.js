import { Router } from "express";
import multer from "multer";
import {
  convertVideoToSlides,
  convertTextToSlides,
} from "../tools/videoToSlides.js";
import { Presentation } from "../models/presentation.js";
import {
  validateUserCredentials,
  validateNoActiveJobs,
} from "../middleware/auth.js";
import { Job } from "../models/job.js";
import { Notification } from "../models/notification.js";
import slidesApi from "../tools/slides/api.js";
import { sendNotification } from "../tools/notifications.js";

const upload = multer({ dest: "uploads/" });

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
    // TODO: store jobs and generate IDs elsewhere
    const jobId = Date.now() + "m" + `${Math.floor(Math.random() * 10000)}`;
    const job = await Job.create({
      jid: jobId,
      status: "running",
      startedAt: new Date(),
      UserUserId: userId,
    });
    convertVideoToSlides(
      {
        filePath: file.path,
        fileName: file.filename,
        title,
        slidesOAuthToken: req.session.accessToken,
      },
      (statusMessage) => {
        req.io.emit(`slides/${jobId}/status`, statusMessage);
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
        if (!r.error) {
          const { presentationId } = r;
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
    // TODO: store jobs and generate IDs elsewhere
    const jobId = Date.now() + "m" + `${Math.floor(Math.random() * 10000)}`;
    const job = await Job.create({
      jid: jobId,
      status: "running",
      startedAt: new Date(),
      UserUserId: userId,
    });
    convertTextToSlides(
      {
        text,
        title,
        slidesOAuthToken: req.session.accessToken,
      },
      (statusMessage) => {
        req.io.emit(`slides/${jobId}/status`, statusMessage);
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
        } else {
          job.status = "error";
        }
        await job.save();
        req.io.emit(`slides/${jobId}/done`, r);
      },
    );
    return res.json({ msg: "Job started", id: jobId });
  },
);

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
  const activeJobs = await Job.findAll({
    where: {
      UserUserId: userId,
      status: "running",
    },
  });
  return res.json({ jobs: activeJobs });
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
