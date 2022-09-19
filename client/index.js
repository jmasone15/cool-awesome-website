const socket = io();
const btnOne = document.getElementById("button1");
const btnTwo = document.getElementById("button2");
const roomHeader = document.getElementById("room-header");
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const defaultDiv = document.getElementById("default");
const roomDiv = document.getElementById("room");
let currentRoom;

socket.on("init", msg => {
    console.log(msg);
});

btnOne.addEventListener("click", handleBtnClick);
btnTwo.addEventListener("click", handleBtnClick);

function handleBtnClick(e) {
    e.preventDefault();

    const room = e.target.getAttribute("room");
    socket.emit("join", room);
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