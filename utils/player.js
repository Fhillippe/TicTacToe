class Player {
  constructor(id) {
    this._id = id;
    this._symbol = "";
    this._room = "";
    this._name = "";
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

module.exports = Player;
