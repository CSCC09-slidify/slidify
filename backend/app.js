import express from "express";
import { slidesRouter } from "./routers/slidesRouter.js";
import bodyParser from "body-parser";

export const app = express();

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

app.use("/api/slides", slidesRouter);

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT)
});