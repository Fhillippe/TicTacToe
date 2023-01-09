class Player {
  constructor(socket) {
    this._id = socket.id;
    this._symbol = "";
    this._room = "lobby";
    this._name = "";
    this._socket = socket;
  }
  get room() {
    return this._room;
  }
  get socket() {
    return this._socket;
  }
  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  set symbol(symbol) {
    this._symbol = symbol;
  }
  set name(name) {
    this._name = name;
  }
  set room(room) {
    this._room = room;
  }
}

module.exports = { Player };
