const overviewDom = document.querySelector("#overview");
overviewDom.addEventListener("click", (e) => {
  overview.handleJoinRoom(e.target.closest("div"));
});

const overview = {
  currentOverview: undefined,
  hideOverview() {
    overviewDom.style.display = "none";
  },
  renderOverview(overview = this.currentOverview) {
    overviewDom.style.display = "flex";
    this.currentOverview = overview;
    helpers.clearElement(overviewDom);
    const tiles = this.createRoomTiles(overview);
    helpers.addTilesTo(overviewDom, tiles);
  },
  handleJoinRoom(element = this.currentOverview) {
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
        const joinRoom = helpers.createDomElement(
          "p",
          ["joinRoom"],
          ["Click to Join"]
        );
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
