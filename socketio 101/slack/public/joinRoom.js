function joinRoom(roomName) {
  // send this roomname to server
  nsSocket.emit("joinRoom", roomName, newNumberOfUsers => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfUsers} <span class="glyphicon glyphicon-user"></span>`;
  });
  nsSocket.on("historyCatchUp", history => {
    const messagesUl = document.querySelector("#messages");
    messagesUl.innerHTML = "";
    history.forEach(msg => {
      const newMsg = buildHTML(msg);
      const currentMessages = messagesUl.innerHTML;
      messagesUl.innerHTML = currentMessages + newMsg;
      messagesUl.scrollTo(0, messagesUI.scrollHeight);
    });
  });
  nsSocket.on("updateMembers", numberOfUsers => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${numberOfUsers} <span class="glyphicon glyphicon-user"></span>`;
    document.querySelector(".curr-room-text").innerHTML = `${roomName}`;
  });
}
