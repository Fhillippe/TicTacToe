const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Rooms = require("./utils/rooms");
const { Player } = require("./utils/player");
const Game = require("./utils/game");

const PORT = 3000;
const app = express();
const server = http.createServer(app);
io = socketIo(server);

const rooms = new Rooms();
let names = [];

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send({ a: "huj" });
});

io.on("connection", (socket) => {
  socket.join("lobby");
  const player = new Player(socket);
  socket.emit("welcome", rooms.overview);
  socket.on("tryName", (name) => {
    if (!names.includes(name)) {
      names.push(name);
      player.name = name;
      socket.emit("nameGood", name);
    } else {
      socket.emit("message", { msg: "Sorry name taken." });
    }
  });
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
      const game = new Game(rooms.getRoom(roomId), io, rooms);
      game.on();
    }
  });
  socket.on("leaveRoom", () => {
    io.in(player.room).emit("leaveGame");
    socket.leave(player.room);
    socket.join("lobby");
    rooms.resetRoom(player.room);
    io.in(player.room).emit("message", {
      msg: "Second player has left, returning you to the lobby.",
    });
    io.emit("renderOverview", rooms.overview);
  });
  socket.on("sendMessage", (msg) => {
    io.in(player.room).emit("message", { msg, author: player.name });
  });
  socket.on("disconnect", () => {
    if (player.room !== "lobby") {
      rooms.resetRoom(player.room);
      socket.leave(player.room);
      io.in(player.room).emit("leaveGame");
    }
    if (player.name) {
      names = names.filter((name) => name !== player.name);
    }
    io.emit("renderOverview", rooms.overview);
  });
});

server.listen(PORT, () => {
  console.log(`server is working, listening on port ${PORT}`);
});
