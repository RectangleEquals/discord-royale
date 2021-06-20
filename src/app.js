const WebSocketServer = require("ws").Server;
const http = require("http");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
let server;

app.use(express.static(__dirname + "/"));

server = http.createServer(app);
server.listen(port);
console.log("http server listening on %d", port);

var wss = new WebSocketServer({server: server});
console.log("websocket server created");

module.exports = { server: { express: app, http: server, ws: wss, port } };