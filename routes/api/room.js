const router = require("express").Router();
const { Room } = require("../../models");

router.get("/create", async (req, res) => {
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

router.post("/join", async (req, res) => {
    const existingRoom = await Room.findOne({ where: { room_code: req.body.room_code, active_ind: true } });

    if (!existingRoom) {
        return res.json({ success: false })
    } else {
        return res.json({ success: true, room: existingRoom })
    }
});

module.exports = router;