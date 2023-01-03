class Room {
  constructor() {
    this._players = [];
    this._board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this._turn = "circle";
    this._gameOn = false;
  }
  get board() {
    return this._board;
  }
  get turn() {
    return this._turn;
  }
  get players() {
    return this._players;
  }
  set players(players) {
    this._players = players;
  }
  switchGame() {
    this._gameOn = !this._gameOn;
  }
  changeTurn() {
    this._turn = this._turn === "circle" ? "cross" : "circle";
  }
  addPlayer({ playerName, playerId }) {
    this._players.push({ playerName, playerId });
  }
  removePlayer(playerId) {
    this.players = this.players.filter((player) => {
      player.playerId = playerId;
    });
  }
  changeBoard(index, symbol) {
    if (this._turn !== symbol) return;
    this._board[index] = symbol;
    this.changeTurn(room);
  }
}

module.exports = Room;
