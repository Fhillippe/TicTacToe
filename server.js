const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Rooms = require("./utils/rooms");
const { Player, names } = require("./utils/player");
const Game = require("./utils/game");

const PORT = 3000;
const app = express();
const server = http.createServer(app);
io = socketIo(server);

const rooms = new Rooms();

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.join("lobby");
  const player = new Player(socket);
  player.listen();
  socket.emit("welcome", rooms.overview);
  socket.on("joinRoom", (roomId) => {
    if (!player.name) {
      socket.emit("message", { msg: "You need name to join room." });
      return;
    }
    socket.emit("message", { msg: `Welcome in room number ${roomId}` });
    socket.leave("lobby");
    rooms.addPlayerToRoom(roomId, player);
    socket.emit("enterRoom", roomId);
    io.emit("renderOverview", rooms.overview);
    if (rooms.getRoom(roomId).isFull) {
      const game = new Game(rooms.getRoom(roomId), io, socket);
      game.on();
    }
  });
  socket.on("sendMessage", (msg) => {
    io.in(player.room).emit("message", { msg, author: player.name });
  });
  socket.on("disconnect", () => {
    if (player.room !== "lobby") {
      rooms.removePlayer(player.room, player.id);
      socket.leave(player.room);
      io.in(player.room).emit("leaveGame");
    }
    if (player.name) {
      names.splice(player.name, 1);
    }
    io.emit("renderOverview", rooms.overview);
  });
});

server.listen(PORT, () => {
  console.log(`server is working, listening on port ${PORT}`);
});
