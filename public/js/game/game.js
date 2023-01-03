class Game {
  constructor(socket, boardDom, roomId) {
    this._socket = socket;
    this._boardDom = boardDom;
    this._roomId = roomId;
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
  enterRoom() {
    this.showBoard();
    this.addTiles();
  }
}
