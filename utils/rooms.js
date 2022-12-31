let rooms = [];

const changeBoard = (room, index) => {
  rooms[room].board[index] = 1;
};

const getRooms = () => {
  return rooms;
};

const findGame = () => {
  const roomToJoin = rooms.findIndex((room) => room.players.length === 1);
  return roomToJoin === -1 ? false : roomToJoin;
};

const joinRoom = (roomToJoin, newPlayer) => {
  rooms[roomToJoin].players.push(newPlayer);
};

const createRoom = (id) => {
  rooms.push({ players: [id], board: [0, 0, 0, 0, 0, 0, 0, 0, 0] });
  return rooms.length - 1;
};

const removePlayer = (id, host) => {
  if (host) {
    delete rooms[id];
  } else {
    Object.keys(rooms).forEach((room) => {
      if (rooms[room].oppenent === id) {
        rooms[room].oppenent = "";
      }
    });
  }
};
const getBoard = (id) => {
  return rooms[id].board;
};

module.exports = {
  changeBoard,
  getRooms,
  findGame,
  joinRoom,
  createRoom,
  removePlayer,
  getBoard,
};
