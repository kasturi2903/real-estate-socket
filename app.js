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
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import dotenv from "dotenv";

// // ✅ Load environment variables from .env
// dotenv.config();

// // Step 1: Create Express app and get PORT from env
// const app = express();
// const PORT = process.env.PORT || 4000;

// // Step 2: Create HTTP server
// const server = http.createServer(app);

// // Step 3: Initialize Socket.IO with CORS setup
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   },
// });

// // Step 4: Online user management
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

// // Step 5: Handle Socket.IO connections
// io.on("connection", (socket) => {
//   console.log("✅ User connected:", socket.id);

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

// // ✅ Step 6: Render health check
// app.get("/", (req, res) => {
//   res.send("✅ Socket server is running.");
// });

// // ✅ Step 7: Start server and bind to 0.0.0.0 for Render
// server.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Socket server listening on port ${PORT}`);
// });
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Enable CORS in Express
app.use(cors({
  origin: "https://real-estate-client-bia0.onrender.com", // ✅ no trailing slash
  methods: ["GET", "POST"],
  credentials: true,
}));

// ✅ Handle preflight for all routes (esp. for POST)
app.options("*", cors());

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: "https://real-estate-client-bia0.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ In-memory tracking of online users
let onlineUser = [];

const addUser = (userId, socketId) => {
  if (!onlineUser.some(user => user.userId === userId)) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find(user => user.userId === userId);
};

// ✅ Socket.IO events
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
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Render health check endpoint
app.get("/", (req, res) => {
  res.send("✅ Socket server is live 🎉");
});

// ✅ Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Socket server running on port ${PORT}`);
});
