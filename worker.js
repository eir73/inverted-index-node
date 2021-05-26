const fs = require("fs");
const { workerData, parentPort } = require("worker_threads");
const { fileNames } = workerData;

(() => {
  for (let i = 0; i < fileNames.length; i++) {
    const textContent = fs.readFileSync(`./data/${fileNames[i]}`, "utf-8");

    const wordsArray = textContent.replace(/[^a-zA-Z0-9 -]/g, "").split(" ");

    wordsArray.forEach((word, index) => {
      parentPort.postMessage({
        word,
        index,
        file: fileNames[i],
      });
    });
  }
})();
