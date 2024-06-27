import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { authRouter } from "./routes/auth_router.js";

export const app = express();

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.use("/api/auth", authRouter);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
