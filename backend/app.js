import express from "express";
import session from "express-session";
import sequelizeStore from "connect-session-sequelize";
import { sequelize } from "./datasource.js";
import { slidesRouter } from "./routers/slidesRouter.js";
import { notificationsRouter } from "./routers/notificationsRouter.js";
import { usersRouter } from "./routers/usersRouter.js";
import { registerIOListeners } from "./sockets.js";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

export const app = express();
const httpServer = http.createServer(app);

const PORT = 3000;

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

try {
  await sequelize.authenticate();
  // Automatically detect all of your defined models and create (or modify) the tables for you.
  // This is not recommended for production-use, but that is a topic for a later time!
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.set("trust proxy", 1);
const corsOptions = {
  origin: [process.env.CORS_ORIGIN, "https://slidify.live", , "https://slidifylabs.live", 
    "52.146.58.224", "52.146.58.159", "52.146.59.242", "52.146.59.213", "52.146.58.64", "52.149.21.32", "52.149.21.10", "52.137.102.83", "40.64.107.92", "40.64.107.99"],
  credentials: true,
};
app.use(cors(corsOptions));
app.set("trust proxy", 1);

const sequelizeSessionStore = sequelizeStore(session.Store);
const sessionStore = new sequelizeSessionStore({
  db: sequelize,
  tableName: "Session",
});
app.use(
  session({
    secret: process.env.SLIDIFY_SESSION_SECRET ?? "slidifysecret",
    proxy: true,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: false, domain: "." + process.env.APP_DOMAIN },
  }),
);
sessionStore.sync();

export const io = new Server(httpServer, { cors: corsOptions });
registerIOListeners(io);

app.use((req, res, next) => {
  console.log("HTTP request", req.method, req.url, req.body);
  req.io = io;
  next();
});

app.use("/api/slides", slidesRouter);
app.use("/api/users", usersRouter);
app.use("/api/notifications", notificationsRouter);

httpServer.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
