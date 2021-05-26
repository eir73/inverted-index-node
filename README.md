# inverted-index-node
Node.js client-server app for indexing files using worker_threads

## Setup
To run the project on your computer your need to:
```
npm i
npm run start:server
npm run start:client
```

## Usage
This project is used to build inverted index for every word in your .txt files

To make sure it works properly
1. run two cmd instances
2. run ```npm run start:server``` in first cmd instance
3. run ```npm run start:client``` in second cmd instance
4. wait for the server to start
5. enter the word you want to find information for in second cmd instance
