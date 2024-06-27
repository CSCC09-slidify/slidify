import { Router } from "express";
import multer from "multer";
import { convertVideoToSlides } from "../tools/videoToSlides.js";

const upload = multer({ dest: 'uploads/' })

export const slidesRouter = Router();

slidesRouter.post("/", upload.single("file"), async (req, res) => {
    console.log("file is")
    console.log(req.file);
    const file = req.file;
    const { title, accessToken } = req.query;
    convertVideoToSlides(
        {
            filePath: file.path,
            fileName: file.filename,
            title,
            slidesOAuthToken: accessToken
        },
        (r) => {
            res.json(r);
        }
    );
})