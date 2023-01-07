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
