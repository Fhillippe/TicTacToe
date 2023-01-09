const overviewDom = document.querySelector("#overview");
overviewDom.addEventListener("click", (e) => {
  overview.handleJoinRoom(e.target.closest("div"));
});

const overview = {
  hideOverview() {
    overviewDom.style.display = "none";
  },
  showOverview() {
    overviewDom.style.display = "flex";
  },
  renderOverview(overview) {
    overviewDom.style.display = "flex";
    helpers.clearElement(overviewDom);
    const tiles = this.createRoomTiles(overview);
    helpers.addTilesTo(overviewDom, tiles);
  },
  updateOverview(newOverview) {
    newOverview.forEach(() => {});
  },
  handleJoinRoom(element) {
    if (element.classList.contains("roomTile")) {
      const roomId = element
        .querySelector(".roomTileId")
        .innerHTML.match(/\d/)[0];
      socket.emit("joinRoom", roomId);
    }
  },
  createRoomTiles(overview) {
    const tiles = [];
    overview.forEach((room) => {
      const numberOfPlayers = room.players;
      if (numberOfPlayers !== 2) {
        const id = helpers.createDomElement(
          "p",
          ["roomTileId"],
          ["Room: ", room.roomId]
        );
        const players = helpers.createDomElement(
          "p",
          ["roomTileAmountOfPlayers"],
          [`Players: ${numberOfPlayers}/2`]
        );
        const joinRoom = helpers.createDomElement("p", ["joinRoom"], ["Enter"]);
        const div = helpers.createDomElement(
          "div",
          ["roomTile"],
          [id, players, joinRoom]
        );
        tiles.push(div);
      }
    });
    return tiles;
  },
};
