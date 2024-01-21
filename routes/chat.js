import express from "express";

import { verfiyToken } from "../helpers/auth.helper.js";
import { getConversation, sendMessage } from "../controllers/chat.js";

const router = express.Router();

router.post("/chat/:id", verfiyToken,sendMessage);
router.get("/messages/:receiver", verfiyToken,getConversation);


export default router;
