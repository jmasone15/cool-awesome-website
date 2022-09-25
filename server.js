// Dependencies
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const http = require('http');
const sequelize = require("./config/connection");

// Express Initilization
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "client")));

// Socket Setup
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Socket
io.on("connection", socket => {
  socket.emit("init", { data: "Hello, world!" });
});

io.on("connection", socket => {
  socket.on("join", room => {
    socket.join(room);
    console.log(`A user joined room: ${room}`);
    io.to(room).emit("joined", room)
  });
});

io.on("connection", socket => {
  socket.on("message", (msg, room) => {
    console.log(`Room: ${room} | Message: ${msg}`);
    io.to(room).emit("message", msg)
  })
});

// Server Start Up
server.listen(PORT, () => {
  console.log(`🌎 Server Listening at: http://localhost:${PORT} 🌎`);
  sequelize.sync({ force: false });
  console.log("MySQL Database Connected successfully");
});