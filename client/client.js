const net = require("net");
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = new net.Socket();
client.setEncoding("utf-8");
client.connect(5000, "localhost", () => {
  console.log("connected");
  rl.question("Enter the word you want to find: ", sendWord);
});

client.on("data", (data) => {
  console.log(data);
  rl.question("Enter the word you want to find: ", sendWord);
});

client.on("end", () => {
  throw new Error('the server is closed')
})

function sendWord(word = "") {
  if (word) {
    client.write(word);
  }
}
