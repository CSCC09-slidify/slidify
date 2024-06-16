import express from "express";

export const app = express();

const PORT = 3000;

app.use((req, res, next) => {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT)
});