require("dotenv").config();
const express = require("express");
const path = require("path");
const socket = require("socket.io");
//App setup
const app = express();
app.use(express.static(path.join("../client/build/")));

app.get("/", (req, res) => {
  res.sendFile(path.join("../client/build/index.html"));
});
const port = process.env.PORT || 8000;

const server = app.listen(port, function () {
  console.log("Listening on port " + port);
});
