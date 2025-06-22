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

// Step 1: Create an Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Step 2: Create an HTTP server and bind Express to it
const server = http.createServer(app);

// Step 3: Create Socket.IO server and attach to HTTP server
const io = new Server(server, {
  cors: {
    origin: "https://real-estate-client-bia0.onrender.com", // 🔁 your frontend URL
    credentials: true,
  },
});

// Step 4: Setup basic in-memory online users logic
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

// Step 5: Handle socket events
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

// ✅ Step 6: Add a basic HTTP route so Render detects it's running
app.get("/", (req, res) => {
  res.send("✅ Socket server is running.");
});

// ✅ Step 7: Start the server
// ✅ Step 7: Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Socket server listening on port ${PORT}`);
});
