const express = require("express");
const http = require("http");
const morgan = require("morgan");
const socketIo = require("socket.io");
const {
  getRooms,
  getBoard,
  changeBoard,
  findGame,
  joinRoom,
  createRoom,
  removePlayer,
} = require("./utils/rooms");

const PORT = 3000;

const app = express();
const server = http.createServer(app);
io = socketIo(server);

app.use(morgan("dev"));
app.use(express.static("public"));

io.on("connection", (socket) => {
  let gameOn = false,
    host = false,
    gameId;
  socket.on("change", (index) => {
    changeBoard(gameId, index);
    io.in(gameId).emit("render", getBoard(gameId));
  });
  socket.on("lookingForGame", () => {
    const roomToJoin = findGame();
    gameOn = true;
    if (roomToJoin !== false) {
      gameId = roomToJoin;
      joinRoom(roomToJoin, socket.id);
      socket.emit("joinRoom", roomToJoin);
    } else {
      host = true;
      gameId = createRoom(socket.id);
      socket.emit("newRoom");
    }
    socket.join(gameId);
  });
  socket.on("disconnect", () => {
    if (gameOn) {
      removePlayer(socket.id, host);
    }
  });
});

server.listen(PORT, () => {
  console.log(`server is working, listening on port ${PORT}`);
});
