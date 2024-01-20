import express from "express";
import { getUser, login, signup } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get('/user/:id',getUser);

export default router;
