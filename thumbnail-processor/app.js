const { exec } = require("child_process");
const { Consumer } = require("sqs-consumer");

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

const queueURL = "http://localhost:4566/queue/thumbnail-processor";
const thumbnailBasePath = "/home/rimon/Desktop/files/thumbnails";

const parseSqsMessage = (message) => {
  const parsedMessage = JSON.parse(JSON.parse(message.Body).Message);
  parsedMessage.messageId = message.MessageId;

  return parsedMessage;
};

const app = Consumer.create({
  queueUrl: queueURL,
  handleMessage: async (message) => {
    message = parseSqsMessage(message);
    console.log("Processing Thumbnail:", message.fileName);
    const thumbnailPath = `${thumbnailBasePath}/${message.fileName}`;

    const command = `convert -resize 128 '${message.filePath}' '${thumbnailPath}'`;

    try {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          throw new Error("error");
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          throw new Error("error");
        }
      });
    } catch (e) {
      throw e;
    }
  },
});

app.on("error", (err) => {
  console.error(err.message);
});

app.on("processing_error", (err) => {
  console.error(err.message);
});

app.start();
