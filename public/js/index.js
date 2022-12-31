const boardDom = document.querySelector("#board");
const findGameButton = document.querySelector("button");
const socket = io();

socket.on("render", (board) => {
  console.log(board);
  board.forEach((element, i) => {
    const tile = document.querySelector(`.p${i}`);
    const isOn = tile.classList.contains("x");
    if (Boolean(element) !== isOn) {
      tile.classList.toggle("x");
    }
  });
});

socket.on("joinRoom", (game) => {});

socket.on("newRoom", () => {});

findGameButton.addEventListener("click", () => {
  socket.emit("lookingForGame");
  findGameButton.hidden = true;
  boardDom.style.display = "grid";
});

board.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    socket.emit("change", event.target.classList[1][1]);
  }
});
