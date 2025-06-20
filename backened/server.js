import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { dbConnect } from "./lib/db.js";
import userRouter from "./lib/routes/UserRoutes.js";
import messageRouter from "./lib/routes/messages.routes.js";

const app = express();
const server = http.createServer(app);

// 🔌 Socket.IO instance
export const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ In production, replace * with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
 

// 🧠 Global map of userId to socketId  
export const userSocketMap = {};

// ⚡ Socket.IO logic
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("✅ User connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", userId);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

// 📦 Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors({
  origin: "*", // or your frontend origin
}));


// 🧪 Health check
app.use("/api/status", (req, res) => res.send("✅ Server is live"));

// 🛣️ Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
dbConnect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });
