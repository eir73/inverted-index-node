const { processData } = require("./main");
const express = require("express");
const http = require('http');

const app = express();
const server = http.createServer(app);

processData(+process.argv[2] || 4)
  .then((data) => setupServer(data))
  .catch((error) => console.error(error));

function setupServer(data) {
  server.listen(5000, () => console.log("Server is listening on port 5000"));

  app.get("/word-request", (req, res) => {
    const requestedWord = req.query.word;

    const wordData = data[requestedWord];

    if (wordData) {
      res.json(wordData);
    } else {
      res.send(`Can't find '${requestedWord}' in source files`);
    }
  });
}
