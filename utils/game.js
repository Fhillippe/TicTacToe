class Game {
  constructor(room, io, socket) {
    this._room = room;
    this._playerCircle = "";
    this._playerCross = "";
    this._turn = "cirle";
    this._io = io;
    this._socket = socket;
    this._board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  get board() {
    return this._board;
  }
  get socket() {
    return this._socket;
  }
  get io() {
    return this._io;
  }
  get turn() {
    return this._turn;
  }
  get room() {
    return this._room;
  }
  get playerCircle() {
    return this._playerCircle;
  }
  get playerCross() {
    return this._playerCross;
  }
  set playerCircle(player) {
    this._playerCircle = player;
  }
  set playerCross(player) {
    this._playerCross = player;
  }
  toggleTurn() {
    if (this.turn === "circle") {
      this.turn = "cross";
      this.playerCross.socket.emit("toggleTurn");
    } else {
      this.turn = "cross";
      this.playerCircle.socket.emit("toggleTurn");
    }
  }
  coinFlip() {
    return Math.random() < 0.5;
  }
  shuffleSymbols() {
    const flipResult = this.coinFlip();
    this.playerCircle = this.room.players[Number(flipResult)];
    this.playerCross = this.room.players[Number(!flipResult)];
    this.playerCircle.socket.emit("startGame", "circle");
    this.playerCross.socket.emit("startGame", "cross");
  }
  listen() {
    this.socket.on("changeTile", (changedTile) => {
      this.changeTile(changedTile);
    });
    this.socket.on("toggleTurn", () => {
      this.toggleTurn();
    });
  }
  on() {
    this.listen();
    this.shuffleSymbols();
  }
}

module.exports = Game;
