// Dependencies
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const http = require('http');
const sequelize = require("./config/connection");
const session = require("express-session");
const routes = require("./routes");

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
app.use(routes)

// Server Start Up
server.listen(PORT, () => {
  console.log(`🌎 Server Listening at: http://localhost:${PORT} 🌎`);
  sequelize.sync({ force: true });
  console.log("MySQL Database Connected successfully");
});