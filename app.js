// import { Server } from "socket.io";

// const io = new Server({
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// let onlineUser = [];

// const addUser = (userId, socketId) => {
//   const userExists = onlineUser.find((user) => user.userId === userId);
//   if (!userExists) {
//     onlineUser.push({ userId, socketId });
//   }
// };

// const removeUser = (socketId) => {
//   onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return onlineUser.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {

//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//   });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);
//     if (receiver) {
//       io.to(receiver.socketId).emit("getMessage", data);
//     }
//   });
//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//   });
// });

// io.listen(4000);
// console.log("Socket server is running on port 4000");
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";

// ✅ Load environment variables from .env
dotenv.config();

// Step 1: Create Express app and get PORT from env
const app = express();
const PORT = process.env.PORT || 4000;

// Step 2: Create HTTP server
const server = http.createServer(app);

// Step 3: Initialize Socket.IO with CORS setup
const ORIGIN = "https://real-estate-client-bia0.onrender.com";
app.use(cors({
  origin: ORIGIN,
  methods: ["GET", "POST"],
  credentials: true,
}));

app.options("*", cors()); // Preflight
const io = new Server(server, {
  cors: {
    origin: ORIGIN,
    credentials: true,
  },
});

// Step 4: Online user management
let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

// Step 5: Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

// ✅ Step 6: Render health check
app.get("/", (req, res) => {
  res.send("✅ Socket server is running.");
});

// ✅ Step 7: Start server and bind to 0.0.0.0 for Render
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Socket server listening on port ${PORT}`);
});
