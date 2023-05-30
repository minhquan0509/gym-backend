const express = require("express");
require("./models");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3001, () => console.log("server is running in port 3001"));
