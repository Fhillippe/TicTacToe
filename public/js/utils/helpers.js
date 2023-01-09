const bot = "Usefull bot";
const helpers = {
  createDomElement(type, classlist = [], childrenlist = []) {
    const element = document.createElement(type);
    classlist.forEach((_class) => element.classList.add(_class));
    childrenlist.forEach((child) => {
      if (typeof child === "string") {
        element.innerHTML += child;
      } else {
        element.appendChild(child);
      }
    });
    return element;
  },
  outputMessage(msg, author = bot) {
    let allign;
    if (author !== bot) {
      const name = document.querySelector(".name").innerHTML;
      if (name === author) {
        allign = "allignMessageRight";
      }
    }
    const chatArea = document.querySelector("#chatArea");
    const text = this.createDomElement("p", ["messageText"], [msg]);
    const meta = this.createDomElement("p", ["messageMeta"], [author]);
    const div = this.createDomElement("div", ["message", allign], [meta, text]);
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
  },
  getHighlightIndexes(highlight) {
    if (highlight === "all") {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8];
    }
    const line = highlight.slice(0, -1);
    let number = Number(highlight.slice(-1));
    if (line === "row") {
      number *= 3;
      return [number, number + 1, number + 2];
    } else if (line === "column") {
      return [number, number + 3, number + 6];
    }
    if (number === 0) {
      return [0, 4, 8];
    } else {
      return [6, 4, 2];
    }
  },
  highlight(line) {
    const indexes = this.getHighlightIndexes(line);
    return new Promise((resolve) => {
      setTimeout(resolve, 3000);
      indexes.forEach((index) => {
        tile = document.querySelector(`.p${index}`);
        tile.classList.add("flashing");
      });
    });
  },
  addTilesTo(element, tiles) {
    tiles.forEach((room) => {
      element.appendChild(room);
    });
  },
  clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },
  getGameOpenMsg(symbol) {
    const firstHalf = `You are playing with ${symbol}, `;
    const secondHalf =
      symbol === "Circle" ? "begin." : "wait for cirlce to move.";
    return firstHalf + secondHalf;
  },
};
