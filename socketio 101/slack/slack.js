const express = require("express");
const socketio = require("socket.io");
const app = express();

let namespaces = require("./data/namespaces");

//console.log(namespaces[0]);

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);

const io = socketio(expressServer);

io.on("connection", socket => {
  // build an array to send back with image and endpoint for each ns
  let nsData = namespaces.map(ns => {
    return {
      img: ns.img,
      endpoint: ns.endpoint
    };
  });
  //console.log(nsData);
  //send ns data back to client. We need to use socket, NOT io because we want it to go to just this client
  socket.emit("nsList", nsData);
});

// loop through each namespace and listen for a connection
namespaces.forEach(namespace => {
  //console.log(namespace);
  io.of(namespace.endpoint).on("connection", nsSocket => {
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
    // a socket has connected to one of our chatgroup namespaces
    // send that ns group info back
    nsSocket.emit("nsRoomLoad", namespaces[0].rooms);
    nsSocket.on("joinRoom", (roomToJoin, numberOfUsersCallback) => {
      // deal with history once we have it
      nsSocket.join(roomToJoin);
      /* io.of("/wiki")
        .in(roomToJoin)
        .clients((error, clients) => {
          console.log(clients.length);
          numberOfUsersCallback(clients.length);
        }); */
      const nsRoom = namespaces[0].rooms.find(room => {
        return (room.roomTitle = roomToJoin);
      });
      nsSocket.emit("historyCatchUp", nsRoom.history);

      io.of("wiki")
        .in(roomToJoin)
        .clients((error, clients) => {
          console.log(clients.length);
          io.of("wiki")
            .in(roomToJoin)
            .emit("updateMembers", clients.length);
        });
    });
    nsSocket.on("newMessageToServer", msg => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: "rbunch",
        avatar: "https://via.placeholder.com/30"
      };
      console.log(msg);
      console.log(nsSocket.rooms);
      const roomTitle = Object.keys(nsSocket.rooms)[1];

      // we need to find the room object for this room
      const nsRoom = namespaces[0].rooms.find(room => {
        return (room.roomTitle = roomTitle);
      });
      console.log(nsRoom);
      nsRoom.addMessage(fullMsg);
      io.of("/wiki")
        .to(roomTitle)
        .emit("messageToClients", fullMsg);
    });
  });
});
