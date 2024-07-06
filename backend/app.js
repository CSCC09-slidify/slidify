import express from "express";
import { slidesRouter } from "./routers/slidesRouter.js";
import bodyParser from "body-parser";
import cors from "cors";
import { authRouter } from "./routes/auth_router.js";
import { sequelize } from "./datasource.js";

export const app = express();

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
  origin: "http://localhost",
  credentials: true,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.use("/api/slides", slidesRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
