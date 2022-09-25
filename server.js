// Dependencies
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const http = require('http');
const sequelize = require("./config/connection");
const routes = require("./routes");
const session = require("express-session");
const { Room } = require("./models");

// Express Initilization
const app = express();
const PORT = process.env.PORT || 3001;

// Socket Setup
const server = http.createServer(app);
const socketIo = require("./middleware/socket");
const io = socketIo.getIo(server);

// Middleware
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "client")));
app.use(session({
  secret: "secret123",
  cookie: {
    // 15 minutes
    maxAge: 900000
  },
  name: "user",
  resave: false
}));

// Routes
app.get("/create", async (req, res) => {
    let code = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 4; i++) {
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    const newRoom = await Room.create({
      room_code: code,
      owner: req.session.id
    });

    return res.status(200).json({ success: true, room: newRoom })
});

// Socket
// io.on("connection", socket => {
//   socket.on("join", room => {
//     socket.join(room);
//     console.log(`A user joined room: ${room}`);
//     io.to(room).emit("joined", room)
//   });
// });

// io.on("connection", socket => {
//   socket.on("message", (msg, room) => {
//     console.log(`Room: ${room} | Message: ${msg}`);
//     io.to(room).emit("message", msg)
//   })
// });

// Server Start Up
server.listen(PORT, () => {
  console.log(`🌎 Server Listening at: http://localhost:${PORT} 🌎`);
  sequelize.sync({ force: true });
  console.log("MySQL Database Connected successfully");
  io.on("connection", socket => {
    socket.emit("init")
  });
});