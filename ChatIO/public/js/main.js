const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const roomUsers = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const socket = io();

socket.emit("joinroom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room), outputRoomUsers(users);
});

const roomh2 = document.getElementById("sidebar-dets");

function outputMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta"> ${msg.username} <span>${msg.time}</span></p>
  <p class="text">${msg.msg}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

socket.on("message", (msg) => {
  outputMessage(msg);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  console.log(msg);
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputRoomUsers(users) {
  roomUsers.innerHTML = `${users
    .map((u) => `<li>${u.username}</li>`)
    .join("\n")}`;
}
