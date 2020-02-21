function joinNs(endpoint) {
  const nsSocket = io(`http://localhost:9000${endpoint}`);
  nsSocket.on("nsRoomLoad", nsRooms => {
    console.log(nsRooms);
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    let glyph = "";
    if (nsRooms.privateRoom) {
      glyph = "lock";
    } else {
      glyph = "globe";
    }
    nsRooms.forEach(room => {
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}">${room.roomTitle}</span></li>`;
    });
    // add click listener to each room
    let roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach(elem => {
      elem.addEventListener("click", e => {
        console.log("Someone clicked on", e.target.innerText);
      });
    });
  });

  nsSocket.on("messageToClients", msg => {
    console.log(msg);
    document.querySelector("#messages").innerHTML += `<li>${msg.text}</li>`;
  });

  document.querySelector(".message-form").addEventListener("submit", event => {
    event.preventDefault();
    let newMessage = document.querySelector("#user-message").value;
    socket.emit("newMessageToServer", { text: newMessage });
  });
}
