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

        //get existing users
        let user_list = existingRoom.users;
        let id = req.session.id;
        let users = []

        //owner is attempting to join their own room
        if(id == existingRoom.owner){
            return res.json({ success: false })
        }

        //append current session id to users
        if(!user_list){
            users.push(id);
        }
        else{
            users = JSON.parse(user_list);

            //id already found in users
            if(users.indexOf(id) > -1){
                return res.json({ success: false })
            }
            users.push(id);
        }

        //create JSON string of users and save to db
        existingRoom.users = JSON.stringify(users);
        await existingRoom.save();

        return res.json({ success: true, room: existingRoom })
    }
});

module.exports = router;