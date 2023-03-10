const chatForm = document.querySelector("#chatForm");
const chatText = document.querySelector("#chatFormText");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (chatText.value) {
    socket.emit("sendMessage", chatText.value);
    chatText.value = "";
  }
});
chatText.addEventListener("focus", () => {
  chatText.placeholder = "Write message...";
});
chatText.addEventListener("blur", () => {
  chatText.placeholder = "Aa";
});
