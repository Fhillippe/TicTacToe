class Game {
  constructor(roomId) {
    this._boardDom = document.querySelector("#board");
    this._roomId = roomId;
    this._turn = "circle";
    this._symbol = "";
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
  set boardDom(newBoardDom) {
    this._boardDom = newBoardDom;
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
  hideResetScoreBoard() {
    const scoreBoard = document.querySelector("#scoreBoard");
    scoreBoard.style.display = "none";
    const scores = document.querySelectorAll(".score");
    scores.forEach((score) => {
      score.innerHTML = "0";
    });
  }
  closeGame() {
    this.boardDom.style.display = "none";
    this.removeLeaveButton();
    this.hideResetScoreBoard();
  }
  addLeaveButton() {
    const leaveButton = helpers.createDomElement(
      "button",
      ["leaveButton"],
      ["Leave room"]
    );
    document.querySelector("body").appendChild(leaveButton);
    leaveButton.addEventListener("click", () => {
      helpers.outputMessage("Back in Lobby");
      socket.emit("leaveRoom");
    });
  }
  removeLeaveButton() {
    document
      .querySelector("body")
      .removeChild(document.querySelector(".leaveButton"));
  }
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
    this.addLeaveButton();
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
    const tiles = document.querySelectorAll(".boardTile");
    tiles.forEach((tile) => {
      if (!tile.classList.contains("active")) {
        tile.classList.add("active");
      }
      tile.classList.remove("cross");
      tile.classList.remove("circle");
      tile.classList.remove("flashing");
    });
  }
  listen() {
    socket.on("addPoint", () => {
      this.addPoint();
    });
    socket.on("toggleTurn", () => {
      this.toggleTurn();
    });
    socket.on("updateBoard", (index) => {
      this.updateBoard(index);
    });
    socket.on("restartGame", (highlight) => {
      helpers.highlight(highlight).then(() => {
        this.restartGame();
      });
    });
  }
  on(symbol) {
    this.symbol = symbol.toLowerCase();
    this.allowMoves();
    const message = helpers.getGameOpenMsg(symbol);
    helpers.outputMessage(message);
    this.listen();
  }
}
