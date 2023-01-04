class Game {
  constructor(socket, boardDom, roomId) {
    this._socket = socket;
    this._boardDom = boardDom;
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
  get socket() {
    return this._socket;
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
  toggleTurn() {
    this.turn = this.turn === "circle" ? "cross" : "circle";
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
  showBoard() {
    this.boardDom.style.display = "grid";
  }
  move(index, element) {
    element.classList.remove("active");
    element.classList.add(this.symbol);
    this.socket.emit("changeTile", { index, symbol: this.symbol });
    this.socket.emit("toggleTurn");
    this.toggleTurn();
  }

  allowMoves() {
    this.boardDom.addEventListener("click", (e) => {
      const element = e.target;
      if (element.classList.contains("active") && this.turn === this.symbol) {
        const index = element.classList.item(1)[1];
        this.move(index, element);
      }
    });
  }
  enterRoom() {
    this.showBoard();
    this.addTiles();
  }
  listen() {
    this.socket.on("toggleTurn", () => {
      console.log("huj");
    });
  }
  on(symbol) {
    this.symbol = symbol;
    this.allowMoves();
    const message = helpers.getGameOpenMsg(symbol);
    helpers.outputMessage(message);
    this.listen();
  }
}
