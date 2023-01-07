const names = [];

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
  listen() {
    this.socket.on("tryName", (name) => {
      if (!names.includes(name)) {
        names.push(name);
        this.name = name;
        this.socket.emit("nameGood", name);
      } else {
        this.socket.emit("message", { msg: "Sorry name taken." });
      }
    });
  }
}

module.exports = { Player, names };
