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

  let searchBox = document.querySelector('#search-box');
  searchBox.addEventListener('input', (e) => {
    console.log(e.target.value);
    let messages = Array.from(document.getElementsByClassName('message-text'))
    console.log(messages)
    messages.forEach((msg) => {
      if (msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1) {
        msg.style.display = "none"
      } else {
        msg.style.display = "block"
      }
    })
  })
}
