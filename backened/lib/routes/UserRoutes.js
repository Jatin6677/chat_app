import express from "express";
import {
  signup,
  login
} from "../controllers/userController.js";

import {
  checkAuth,
  protectRoute,
  updateProfile
} from "../middleware/auth.js";

const userRouter = express.Router();

// ✅ User Registration
userRouter.post("/signup", signup);

// ✅ User Login
userRouter.post("/login", login);

// ✅ Update Profile (protected route)
userRouter.put("/update-profile", protectRoute, updateProfile);

// ✅ Check Authentication (token verification)
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;
