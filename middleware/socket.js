const { Server } = require("socket.io")

module.exports = {
    getIo: (server) => {
        const io = new Server(server);

        io.on("connection", socket => {
            socket.on("create", code => {
                socket.join(code);
                console.log("Room: " + code);
                io.to(code).emit("created", code)
            })
        })
        return io
    }
}