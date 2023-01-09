const Room = require("./room");

class Rooms {
  constructor() {
    this._rooms = {
      1: new Room(1),
      2: new Room(2),
      3: new Room(3),
      4: new Room(4),
      5: new Room(5),
    };
  }
  get overview() {
    const overview = [];
    for (const room in this._rooms) {
      overview.push({
        roomId: room,
        players: this._rooms[room].players.length,
      });
    }
    return overview;
  }
  get rooms() {
    return this._rooms;
  }
  resetRoom(roomId) {
    this._rooms[roomId] = new Room(roomId);
  }
  getRoom(roomId) {
    return this.rooms[roomId];
  }
  addPlayerToRoom(roomId, player) {
    player.room = roomId;
    player.socket.join(roomId);
    this.rooms[roomId].addPlayer(player);
  }
}

module.exports = Rooms;
