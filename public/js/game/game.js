class Game {
  constructor(boardDom, roomId) {
    this._boardDom = boardDom;
    this._roomId = roomId;
    this._turn = "circle";
    this._symbol = "";
    this._chatBox = document.querySelector("#chatBox");
  }
  get symbol() {
    return this._symbol;
  }
  get turn() {
    return this._turn;
  }
  get boardDom() {
    return this._boardDom;
  }
  get roomId() {
    return this._roomId;
  }
  set turn(symbol) {
    this._turn = symbol;
  }
  set symbol(symbol) {
    this._symbol = symbol;
  }
  get getOpposite() {
    return this.turn === "circle" ? "cross" : "circle";
  }
  toggleTurn() {
    this.turn = this.getOpposite;
  }
  addTiles() {
    for (let i = 0; i < 9; i++) {
      const tile = helpers.createDomElement("div", [
        "boardTile",
        `p${i}`,
        "active",
      ]);
      this.boardDom.appendChild(tile);
    }
  }
  leaveGame() {
    helpers.outputMessage(
      "Second player has left the room, returning you to the lobby."
    );
    this.boardDom.style.display = "none";
    overview.renderOverview();
  }
  addLeaveButton() {}
  removeLeaveButton() {}
  showBoard() {
    helpers.clearElement(this.boardDom);
    this.boardDom.style.display = "grid";
  }
  changeBoard(index, element) {
    element.classList.remove("active");
    element.classList.add(this.symbol);
    socket.emit("changeBoard", index);
    socket.emit("changeTurn");
  }
  updateBoard(index) {
    const tile = document.querySelector(`.p${index}`);
    tile.classList.add(this.turn);
    tile.classList.remove("active");
  }
  allowMoves() {
    this.boardDom.addEventListener("click", (e) => {
      const element = e.target;
      if (element.classList.contains("active") && this.turn === this.symbol) {
        const index = element.classList.item(1)[1];
        this.changeBoard(index, element);
      }
    });
  }
  enterRoom() {
    this.showBoard();
    this.addTiles();
    this.showScore();
  }
  showScore() {
    const scoreBoard = document.querySelector("#scoreBoard");
    scoreBoard.style.display = "flex";
  }
  addPoint() {
    const scoreDom = document.querySelector(`.${this.turn}Score`);
    const score = Number(scoreDom.innerHTML);
    scoreDom.innerHTML = score + 1;
  }
  restartGame() {
    this.addPoint();
    const tiles = document.querySelectorAll(".boardTile");
    tiles.forEach((tile) => {
      if (!tile.classList.contains("active")) {
        tile.classList.add("active");
      }
      tile.classList.remove("cross");
      tile.classList.remove("circle");
    });
  }

  listen() {
    socket.on("leaveGame", () => {
      this.leaveGame();
    });
    socket.on("toggleTurn", () => {
      this.toggleTurn();
    });
    socket.on("updateBoard", (index) => {
      this.updateBoard(index);
    });
    socket.on("restartGame", () => {
      this.restartGame();
    });
  }
  turOnChat() {
    document.querySelector("#chatForm").style.display = "block";
  }
  on(symbol) {
    this.symbol = symbol.toLowerCase();
    this.allowMoves();
    const message = helpers.getGameOpenMsg(symbol);
    helpers.outputMessage(message);
    this.turOnChat();
    this.listen();
  }
}
