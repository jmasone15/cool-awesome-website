const socket = io();
const createBtn = document.getElementById("create");
const joinBtn = document.getElementById("join");
const roomHeader = document.getElementById("room-header");
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const defaultDiv = document.getElementById("default");
const roomDiv = document.getElementById("room");
const roomInput = document.getElementById("roomInput");
let currentRoom;

createBtn.addEventListener("click", createRoom);
joinBtn.addEventListener("click", joinRoom);

function createRoom(e) {
    e.preventDefault();

    fetch("http://localhost:3001/api/room/create").then(res => {
        res.json().then(data => {
            if (data.success) {
                socket.emit("join", data.room.room_code)
            } else {
                alert("Error creating room.")
            }
        })
    })

}

function joinRoom(e) {
    e.preventDefault();

    if (!roomInput.value) {
        return alert("Please enter a room code")
    }

    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_code: roomInput.value })
    }

    fetch("http://localhost:3001/api/room/join", requestOptions)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert("No room found with that code")
            } else {
                socket.emit("join", data.room.room_code)
            }
        })
}

socket.on("joined", room => {
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