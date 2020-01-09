const socket = io("http://localhost:9000");
const socket2 = io("http://localhost:9000/admin");

socket.on("connect", () => {
  console.log(socket.id);
});

socket2.on("connect", () => {
  console.log(socket2.id);
});

socket2.on("welcome", msg => {
  console.log(msg);
});

socket.on("messageFromServer", dataFromServer => {
  console.log(dataFromServer);
  socket.emit("messageToServer", { data: "Data from the client" });
});

document.querySelector("#message-form").addEventListener("submit", event => {
  event.preventDefault();
  let newMessage = document.querySelector("#user-message").value;
  socket.emit("newMessageToServer", { text: newMessage });
});

socket.on("messageToClient", msg => {
  let newMessage = msg.text;
  document.querySelector("#messages").innerHTML += `<li>${newMessage}</li>`;
});

/* socket.on("ping", () => {
    console.log("ping was received from the server");
  });

  socket.on("pong", latency => {
    console.log(latency);
    console.log("pong was sent to the server");
  }); */
