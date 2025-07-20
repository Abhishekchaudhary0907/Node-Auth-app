import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { db } from "./db/index.js";
import authRoutes from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config({});
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    data: "get success",
  });
});

app.post("/post-test", (req, res) => {
  try {
    const { body } = req;
    const data = body?.data;

    return res.json({
      responseData: "hi",
    });
  } catch (error) {
    console.error("error", error.message);
    res.status(500).send({
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.use("/api/v1", authRoutes);

const dbConnection = async () => {
  try {
    const result = await db();
    if (result) {
      console.log("db connection established");
      app.listen(PORT, () => {
        console.log("app is running on port", PORT);
      });
    }
  } catch (err) {
    console.error("failed");
  }
};

dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log("app is running on port", PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
