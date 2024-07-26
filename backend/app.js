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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

try {
  await sequelize.authenticate();
  // Automatically detect all of your defined models and create (or modify) the tables for you.
  // This is not recommended for production-use, but that is a topic for a later time!
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const corsOptions = {
  origin: [process.env.CORS_ORIGIN],
  credentials: true,
};
app.use(cors(corsOptions));
app.set("trust proxy");

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
    name: "SlidifyCookie",
    cookie: { secure: true, sameSite: 'none', httpOnly: true,  maxAge: 1000 * 60 * 60 * 48}
  })
);
sessionStore.sync();

export const io = new Server(httpServer, { cors: corsOptions });
registerIOListeners(io);

app.use((req, res, next) => {
  console.log("HTTP request", req.method, req.url, req.body);
  console.log(req.session)
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
