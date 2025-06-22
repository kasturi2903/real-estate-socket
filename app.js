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

const app = express();  // ✅ create express app
const server = http.createServer(app); // ✅ attach HTTP server
const PORT = process.env.PORT || 4000;

// ✅ Setup CORS + credentials
const io = new Server(server, {
  cors: {
    origin: "https://real-estate-client-bia0.onrender.com", // your frontend URL
    credentials: true,
  },
});

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

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

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

// ✅ Add a health check route so Render knows it's working
app.get("/", (req, res) => {
  res.send("Socket server is running ✅");
});

// ✅ Start the HTTP server
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
