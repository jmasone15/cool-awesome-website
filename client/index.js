const socket = io();
const createBtn = document.getElementById("create");
const joinBtn = document.getElementById("join");
const roomHeader = document.getElementById("room-header");
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const defaultDiv = document.getElementById("default");
const roomDiv = document.getElementById("room");
let currentRoom;

createBtn.addEventListener("click", createRoom);
joinBtn.addEventListener("click", handleBtnClick);

function createRoom(e) {
    e.preventDefault();

    fetch("http://localhost:3001/create").then(res => {
        res.json().then(data => {
            if (data.success) {
                socket.emit("create", data.room.room_code)
                console.log(data)
            } else {
                alert("Error creating room.")
            }
        })
    })

}

socket.on("Hello!", () => {
    console.log("test")
})

function handleBtnClick(e) {
    e.preventDefault();

    const room = e.target.getAttribute("room");
    socket.emit("join", room);
}

socket.on("created", room => {
    currentRoom = room;
    roomHeader.innerText = `Welcome to Room ${currentRoom}`;
    defaultDiv.setAttribute("class", "display-none");
    roomDiv.removeAttribute("class");
});

form.addEventListener("submit", e => {
    e.preventDefault();

    if (input.value) {
        socket.emit("message", input.value, currentRoom);
        input.value = "";
    }
});

socket.on("message", function (msg) {
    console.log(msg);
    let item = document.createElement("li");
    item.innerText = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight)
});