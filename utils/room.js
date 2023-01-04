class Room {
  constructor(id) {
    this._players = [];
    this._gameOn = false;
    this._id = id;
  }
  get id() {
    return this._id;
  }
  get turn() {
    return this._turn;
  }
  get players() {
    return this._players;
  }
  get isFull() {
    return this.players.length === 2;
  }
  set players(players) {
    this._players = players;
  }
  switchGame() {
    this._gameOn = !this._gameOn;
  }
  addPlayer(player) {
    this._players.push(player);
  }
  removePlayer(playerId) {
    this.players = this.players.filter((player) => {
      return player.id !== playerId;
    });
  }
}

module.exports = Room;
