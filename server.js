import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

import chat from "./socket/chat.js";

import authRoute from "./routes/auth.js";
import chatRoute from "./routes/chat.js";
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
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
app.use(process.env.API_VERSION, chatRoute);

chat(io);


server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
