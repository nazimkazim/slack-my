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
  io.of(namespace.endpoint).on("connection", socket => {
    console.log(`${socket.id} has joined ${namespace.endpoint}`);
  });
});
