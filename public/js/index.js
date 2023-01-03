const boardDom = document.querySelector("#board");
const nameInput = document.querySelector("#nameInputField");
const nameSubmit = document.querySelector("#namSubmit");
const socket = io();
let symbol,
  inRoom = false;

nameSubmit.addEventListener("click", () => {
  const name = nameInput.value;
  if (name) {
    socket.emit("setName", name);
    helpers.displayName(name);
  } else {
    helpers.outputMessage("Empty name.");
  }
});

socket.on("renderOverview", (overview) => {
  if (!inRoom) {
    helpers.renderOverwiev(overview);
  }
});

socket.on("welcome", (overview) => {
  console.log(inRoom);
  if (!inRoom) {
    helpers.outputMessage("Hello, please choose your name.");
    helpers.socket = socket;
    helpers.renderOverwiev(overview);
  }
});

socket.on("enterRoom", (roomId) => {
  inRoom = true;
  helpers.clearOverview();
  const game = new Game(socket, boardDom, roomId);
  game.enterRoom();
});

socket.on("message", ({ msg, author }) => {
  helpers.outputMessage(msg, author);
});

socket.on("startGame", () => {});
