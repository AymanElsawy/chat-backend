import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors';
import authRoute from "./routes/auth.js";
dotenv.config();
const app = express();
app.use(cors());

app.use(express.urlencoded());
app.use(express.json());

await mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.error(err));

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(process.env.API_VERSION, authRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
