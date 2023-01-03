const Room = require("./room");

class Rooms {
  constructor(socket) {
    this._rooms = {
      1: new Room(),
      2: new Room(),
      3: new Room(),
      4: new Room(),
      5: new Room(),
    };
    this._socket = socket;
  }
  get socket() {
    return this._socket;
  }
  get overview() {
    const overview = [];
    for (const room in this._rooms) {
      overview.push({
        roomId: room,
        players: this._rooms[room].players,
      });
    }
    return overview;
  }
  get rooms() {
    return this._rooms;
  }
  set socket(socket) {
    this._socket = socket;
  }
  removePlayer(roomId, playerId) {
    this.rooms[roomId].removePlayer(playerId);
  }
  getRoom(roomId) {
    return this.rooms[roomId];
  }
  joinRoom(roomId, player) {
    if (!player.name) {
      this.socket.emit("message", { msg: "You need to set name first" });
    } else {
      player.roomId = roomId;
      this.socket.join(roomId);
      io.emit("renderOverview", this.rooms.overview);
      this.socket.emit("enterRoom", roomId);
      this.rooms[roomId].addPlayer({
        playerName: player.name,
        playerId: player.id,
      });
    }
  }
}

module.exports = Rooms;
