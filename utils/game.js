class Game {
  constructor(room, io, rooms) {
    this._rooms = rooms;
    this._room = room;
    this._playerCircle = "";
    this._playerCross = "";
    this._turn = "Circle";
    this._io = io;
    this._board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this._sockets = [];
  }
  get board() {
    return this._board;
  }
  get rooms() {
    return this._rooms;
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
  get sockets() {
    return this._sockets;
  }
  set sockets(newSockets) {
    this._sockets = newSockets;
  }
  set board(newBoard) {
    this._board = newBoard;
  }
  set turn(newSymbol) {
    this._turn = newSymbol;
  }
  set playerCircle(newPlayer) {
    this._playerCircle = newPlayer;
  }
  set playerCross(player) {
    this._playerCross = player;
  }
  changeTile(index) {
    this.board[index] = this._turn;
    const sendTo = this.turn === "Circle" ? "Cross" : "Circle";
    this["player" + sendTo].socket.emit("updateBoard", index);
  }
  changeTurn() {
    if (this.turn === "Circle") {
      this.turn = "Cross";
    } else {
      this.turn = "Circle";
    }
    this.roomEmit("toggleTurn");
  }
  coinFlip() {
    return Math.random() < 0.5;
  }
  setPlayers(result) {
    this.playerCircle = this.room.players[Number(result)];
    this.playerCross = this.room.players[Number(!result)];
  }
  setSockets() {
    this.sockets = [this.playerCircle.socket, this.playerCross.socket];
  }
  shufflePlayers() {
    const flipResult = this.coinFlip();
    this.setPlayers(flipResult);
    this.setSockets();
    this.playerCircle.socket.emit("startGame", "Circle");
    this.playerCross.socket.emit("startGame", "Cross");
  }
  restartGame(highlight) {
    this.io.in(String(this.room.id)).emit("restartGame", highlight);
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  checkWinCon() {
    const winLines = {
      row0: new Set(this.board.slice(0, 3)),
      row1: new Set(this.board.slice(3, 6)),
      row2: new Set(this.board.slice(6, 9)),
      column0: new Set([this.board[0], this.board[3], this.board[6]]),
      column1: new Set([this.board[1], this.board[4], this.board[7]]),
      column2: new Set([this.board[2], this.board[5], this.board[8]]),
      cross0: new Set([this.board[0], this.board[4], this.board[8]]),
      cross1: new Set([this.board[2], this.board[4], this.board[6]]),
    };
    const win = Object.keys(winLines).find((line) => {
      const [first] = winLines[line];
      return winLines[line].size === 1 && first === this.turn;
    });
    return win;
  }
  roomEmit(event, payload = {}) {
    this.io.in(String(this.room.id)).emit(event, payload);
  }
  listen() {
    this.sockets.forEach((socket) => {
      socket.on("changeTurn", () => {
        this.changeTurn();
      });
      socket.on("changeBoard", (index) => {
        this.changeTile(index);
        const win = this.checkWinCon();
        if (win) {
          this.roomEmit("message", { msg: `Round over ${this.turn} won!` });
          this.roomEmit("addPoint");
          this.restartGame(win);
        }
        if (!this.board.includes(0)) {
          this.roomEmit("message", { msg: "draw" });
          this.restartGame("all");
        }
      });
    });
  }
  on() {
    this.shufflePlayers();
    this.listen();
  }
}

module.exports = Game;
