const express = require("express");
const app = express();
const PORT = 8000;

app.use((req, res) => {
  console.log("url =", req.url); // Log the request URL
  let pathname = req.url;

  if (pathname === "/name") {
    res.send("林新興");
  } else if (pathname === "/age") {
    res.send("19");
  } else if (pathname === "/gender") {
    res.send("male");
  } else {
    res.status(404).send("Not Found!");
  }
});

console.log("start at: http://127.0.0.1:8000");

app.listen(PORT, () => {
  console.log(`Listening on http://127.0.0.1:${PORT}`);
});
