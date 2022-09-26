const router = require("express").Router();
const roomRoutes = require("./room");

router.use("/room", roomRoutes);

module.exports = router;