const boardDom = document.querySelector("#board");
let inRoom = false,
  game;

socket.on("renderOverview", (newOverview) => {
  if (!inRoom) {
    overview.renderOverview(newOverview);
  }
});

socket.on("welcome", (newOverview) => {
  if (!inRoom) {
    helpers.outputMessage("Hello, please choose your name in order to play.");
    overview.renderOverview(newOverview);
  }
});

socket.on("roomIsFull", () => {
  helpers.outputMessage("Room is full we can play");
});

socket.on("enterRoom", (roomId) => {
  inRoom = true;
  overview.hideOverview();
  game = new Game(boardDom, roomId);
  game.enterRoom();
});

socket.on("message", ({ msg, author }) => {
  helpers.outputMessage(msg, author);
});

socket.on("startGame", (symbol) => {
  game.on(symbol);
});
