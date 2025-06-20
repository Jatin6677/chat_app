import express from "express";
import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageController.js";
import { protectRoute } from "../middleware/auth.js";

const messagerouter = express.Router();

// ✅ Get all users except self + unseen messages count
messagerouter.get("/users", protectRoute, getUsersForSidebar);

// ✅ Get all messages between logged-in user and selected user
messagerouter.get("/:id", protectRoute, getMessages);

// ✅ Mark a specific message as seen
messagerouter.put("/mark/:id", protectRoute, markMessageAsSeen); // ⬅️ Added missing `/` in route path

// ✅ Send a message to a user
messagerouter.post("/send/:id", protectRoute, sendMessage);

export default messagerouter;
