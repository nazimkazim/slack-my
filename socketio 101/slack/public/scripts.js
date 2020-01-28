const socket = io("http://localhost:9000");

socket.on("connect", () => {
  console.log(socket.id);
});

// listen to nsList, which is a list of all the namespaces
socket.on("nsList", nsData => {
  console.log("The list of namespaces has arrived!");
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach(ns => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
  });

  // Add a click listener for each ns
  Array.from(document.getElementsByClassName("namespace")).forEach(elem => {
    //console.log(elem);
    elem.addEventListener("click", e => {
      const nsEndpoint = elem.getAttribute("ns");
      console.log(nsEndpoint);
    });
  });
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
