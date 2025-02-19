import express from "express";
import "dotenv/config";
import dbConnection from "./config/dbConnection.js";

const app = express();
dbConnection();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Interal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
app.listen(port, () => {
  console.log(`server is working on ${port}`);
});
