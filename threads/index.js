const fs = require("fs");
const { Worker } = require("worker_threads");

const dirName = `${__dirname}/data`;
const fileNames = fs.readdirSync(dirName);
const filesAmount = fileNames.length;

const buffer = {};

let start = new Date()

module.exports = {
  processData: (numberThreads = 1) => {
    let counter = numberThreads;
    return new Promise((resolve, reject) => {
      try {
        for (let i = 0; i < numberThreads; i++) {
          const worker = new Worker(require.resolve("./worker.js"), {
            workerData: {
              fileNames: [...fileNames].slice(
                (filesAmount / numberThreads) * i,
                i === numberThreads - 1
                  ? filesAmount
                  : (filesAmount / numberThreads) * (i + 1)
              ),
            },
          });

          worker.on("message", (data) => {
            if (!buffer[data.word]) {
              buffer[data.word] = [];
              buffer[data.word].push({
                file: data.file,
                index: data.index,
              });
            } else {
              const existedDataIndex = buffer[data.word].findIndex(
                (wordData) => wordData.file === data.file
              );
              if (existedDataIndex !== -1) {
                const existedData = buffer[data.word][existedDataIndex];
                existedData.index += `, ${data.index}`;
                buffer[data.word].splice(existedDataIndex, 1, existedData);
              } else {
                buffer[data.word].push({
                  file: data.file,
                  index: data.index,
                });
              }
            }
          });

          worker.on("error", (e) => console.log(e));
          worker.on("exit", () => {
            counter--;
            if (counter === 0) {
              console.log(new Date() - start)
              console.log("All threads have finished working");
              resolve(buffer);
            }
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  },
};
