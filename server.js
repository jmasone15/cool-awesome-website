// Dependencies
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const http = require('http');
const sequelize = require("./config/connection");
const routes = require("./routes");
const session = require("express-session");

// Express Initilization
const app = express();
const PORT = process.env.PORT || 3001;

// Socket Setup
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Middleware
app.use(require("./middleware/socketmw")(io));
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
}))
app.use(routes);

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
});