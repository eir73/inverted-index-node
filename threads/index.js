const fs = require("fs");
const { Worker } = require("worker_threads");

const dirName = `${__dirname}/data`;
const fileNames = fs.readdirSync(dirName);
const filesAmount = fileNames.length;

const threads = 4;
let counter = threads;
const buffer = {};

module.exports = {
  processData: (numberThreads = 1) => {
    return new Promise((resolve, reject) => {
      try {
        for (let i = 0; i < numberThreads; i++) {
          const worker = new Worker(require.resolve("./worker.js"), {
            workerData: {
              fileNames: [...fileNames].slice(
                (filesAmount / threads) * i,
                i === threads - 1
                  ? filesAmount
                  : (filesAmount / threads) * (i + 1)
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
							const existedDataIndex = buffer[data.word].findIndex(wordData => wordData.file === data.file)
							if (existedDataIndex !== -1) {
								const existedData = buffer[data.word][existedDataIndex]
								existedData.index += `, ${data.index}`
								buffer[data.word].splice(existedDataIndex, 1, existedData)
							} else {
								buffer[data.word].push({
									file: data.file,
									index: data.index,
								});
							} 
						}
          });

          worker.on("error", (e) => console.log(e));
          worker.on("exit", (code) => {
            counter--;
            console.log("exit code:", code, Object.keys(buffer).length);
            if (counter === 0) {
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
