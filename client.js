const fetch = require("node-fetch");

fetch("http://localhost:5000/word-request?word=both")
  .then((responce) => responce.json())
  .then((data) => console.log(JSON.stringify(data, null, 2)))
  .catch(console.log);
