import { Router } from "express";
import multer from "multer";
import { convertVideoToSlides } from "../tools/videoToSlides.js";

const upload = multer({ dest: 'uploads/' })

export const slidesRouter = Router();

slidesRouter.post("/", upload.single("file"), async (req, res) => {
    const file = req.file;
    const { title, accessToken } = req.query;
    // TODO: store jobs and generate IDs elsewhere
    const jobId = Date.now() + "$" + Math.random();
    convertVideoToSlides(
        {
            filePath: file.path,
            fileName: file.filename,
            title,
            slidesOAuthToken: accessToken
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
        (r) => {
            req.io.emit(`slides/${jobId}/done`, r);
        }
    );
    return res.json({msg: "Job started", id: jobId});
})