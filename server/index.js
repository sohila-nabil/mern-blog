import express from "express";
import "dotenv/config";
import cors from "cors";
import dbConnection from "./config/dbConnection.js";
import cookiesParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import authRouter from "./routes/authRout.js";
import userRouter from "./routes/userRoute.js";
import postRouter from "./routes/postRoute.js";
import commentRoute from "./routes/commentRoute.js";

const app = express();
dbConnection();

// cors configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// file upload configuration
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookiesParser());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRoute);

// error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Interal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// server configuration
app.listen(port, () => {
  console.log(`server is working on ${port}`);
});
