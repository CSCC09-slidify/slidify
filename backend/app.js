import express from "express";
import { slidesRouter } from "./routers/slidesRouter.js";
import bodyParser from "body-parser";
import cors from "cors";
import { authRouter } from "./routes/auth_router.js";
import { registerIOListeners } from "./sockets.js";
import { Server } from "socket.io";
import http from "http";

export const app = express();
const httpServer = http.createServer(app);

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const corsOptions = {
  origin: ["http://localhost:8080"],
  credentials: true,
};
app.use(cors(corsOptions));

export const io = new Server(httpServer, { cors: corsOptions });
registerIOListeners(io);

app.use((req, res, next) => {
  console.log("HTTP request", req.method, req.url, req.body);
  req.io = io;
  next();
});

app.use("/api/slides", slidesRouter);
app.use("/api/auth", authRouter);

httpServer.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
