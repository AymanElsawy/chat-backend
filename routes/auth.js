import express from "express";
import { getAllUsers, getUser, login, signup } from "../controllers/auth.js";
import { verfiyToken } from "../helpers/auth.helper.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get('/user/:id',verfiyToken,getUser);
router.get('/users',verfiyToken,getAllUsers);

export default router;
