const { Server } = require("socket.io");
const axios = require("axios");

module.exports = {
    getIo: (server) => {
        const io = new Server(server);

        io.on("connection", socket => {
            socket.on("join", code => {
                socket.join(code);
                console.log("Room: " + code);
                io.to(code).emit("joined", code)
            });

            socket.on("message", (msg, code) => {
                console.log(`Room: ${code} | Message: ${msg}`);
                io.to(code).emit("message", msg)
            });

            socket.on("disconnecting", async (reason) => {

                let code;

                if (socket.rooms.size > 1) {
                    for (const room_code of socket.rooms) {
                        if (room_code !== socket.id) {
                            code = room_code;
                            await axios.post("http://localhost:3001/api/room/leave", { room_code });
                        }
                    }
                }

                io.to(code).emit("leaving", code);
            });
        });

        return io
    }
}