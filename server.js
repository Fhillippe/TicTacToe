const express = require("express");
const http = require("http");
const morgan = require("morgan");
const socketIo = require("socket.io");
const Rooms = require("./utils/rooms");
const Player = require("./utils/player");

const PORT = 3000;
const app = express();
const server = http.createServer(app);
io = socketIo(server);

app.use(morgan("dev"));
app.use(express.static("public"));

io.on("connection", (socket) => {
  const rooms = new Rooms(socket);
  const player = new Player(socket.id);
  socket.emit("welcome", rooms.overview);
  socket.on("joinRoom", (roomId) => {
    rooms.joinRoom(roomId, player);
  });
  socket.on("setName", (name) => {
    player.name = name;
  });
  socket.on("disconnect", () => {
    if (player.roomId) {
      rooms.removePlayer(player.roomId, player.id);
    }
  });
});

server.listen(PORT, () => {
  console.log(`server is working, listening on port ${PORT}`);
});
