const nameForm = document.querySelector("#nameForm");

displayName = (name) => {
  const nameBox = document.querySelector("#nameBox");
  helpers.clearElement(nameBox);
  const nameParagraph = helpers.createDomElement("p", ["name"], [name]);
  nameBox.appendChild(nameParagraph);
};
nameForm.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const name = e.target.value;
    if (name) {
      socket.emit("tryName", name);
    } else {
      helpers.outputMessage("Empty name.");
    }
  }
});

socket.on("nameGood", (name) => {
  document.querySelector("#chatFormText").disabled = false;
  displayName(name);
});
