const { Server } = require("socket.io")

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
            })
        });
        
        return io
    }
}