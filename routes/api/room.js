const router = require("express").Router();
const { Room } = require("../../models");

router.post("/create", async (req, res) => {
    try {
        // Check db to see if user already has a room
        // Create room string
        // Check to see if room string already exists.
        // Create room
        
        const newRoom = await Room.create({
            room_code: req.body.room_code,
            owner: req.session.id
        });

        return res.status(200).json(newRoom)
    } catch (error) {
        res.status(500).json({ success: false, msg: error });
    }
});

module.exports = router;