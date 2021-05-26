const { processData } = require("../threads");
const net = require("net");

processData(+process.argv[2] || 4)
  .then((data) => setupServer(data))
  .catch((error) => console.error(error));

function setupServer(data) {
  const server = net.createServer((client) => setupClient(client, data));

  server.listen(5000, () => {
    console.log("server is running on port 5000");
  });

  server.on("error", console.error);
}

function setupClient(client, data) {
  console.log("client connected");

  client.setEncoding("utf-8");

  client.on("data", (requestedWord) => {
    console.log("Client wants to find", requestedWord);
    const wordData = data[requestedWord];
    client.write(
      parseResponce(wordData) || `Can't find '${requestedWord}' in source files`
    );
  });

  client.on("end", () => {
    console.log("client disconnected");
  });
}

function parseResponce(wordData) {
  if (wordData) {
    return wordData.map((data) => `${data.file}: ${data.index}`).join("\n");
  }
}
