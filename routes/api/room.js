const router = require("express").Router();
const { Room } = require("../../models");

router.get("/create", async (req, res) => {
    try {

        // Generate Room Code
        let code = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < 4; i++) {
            code += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        const newRoom = await Room.create({
            room_code: code,
            owner: req.session.id
        });

        req.io.on("connection", socket => {
            socket.join(code)
        })
        console.log(`Room ${code} was created by ${req.session.id}`);

        return res.status(200).json({ success: true, room: newRoom })
    } catch (error) {
        res.status(500).json({ success: false, msg: error });
    }
});

module.exports = router;