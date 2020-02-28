function joinRoom(roomName) {
  // send this roomname to server
  nsSocket.emit("joinRoom", roomName, newNumberOfUsers => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfUsers} <span class="glyphicon glyphicon-user"></span>`;
  });
}
