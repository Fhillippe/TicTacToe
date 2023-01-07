class Game {
  constructor(room, io) {
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
  restartGame() {
    this.io.in(String(this.room.id)).emit("restartGame");
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  checkWinCon() {
    const row1 = new Set(this.board.slice(0, 3));
    const row2 = new Set(this.board.slice(3, 6));
    const row3 = new Set(this.board.slice(6, 9));
    const column1 = new Set([this.board[0], this.board[3], this.board[6]]);
    const column2 = new Set([this.board[1], this.board[4], this.board[7]]);
    const column3 = new Set([this.board[2], this.board[5], this.board[8]]);
    const cross1 = new Set([this.board[0], this.board[4], this.board[8]]);
    const cross2 = new Set([this.board[2], this.board[4], this.board[6]]);
    const win = [
      row1,
      row2,
      row3,
      column1,
      column2,
      column3,
      cross1,
      cross2,
    ].find((set) => {
      const [first] = set;
      return set.size === 1 && first === this.turn;
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
        if (this.checkWinCon()) {
          this.roomEmit("message", { msg: `Round over ${this.turn} won!` });
          this.restartGame();
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
