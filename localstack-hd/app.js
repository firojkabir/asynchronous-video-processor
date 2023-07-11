const { exec } = require("child_process");
const { Consumer } = require("sqs-consumer");
const { publishHdFileProcessingStatusToSns, publishFHDVideoInfoToSns } = require('./sns-util')

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

const queueURL = "http://localhost:4566/queue/hd-processor";
const hdBasePath = "/home/rimon/Desktop/files/hd";

const parseSqsMessage = (message) => {
  const parsedMessage = JSON.parse(JSON.parse(message.Body).Message);
  parsedMessage.messageId = message.MessageId;

  return parsedMessage;
};

const app = Consumer.create({
  queueUrl: queueURL,
  handleMessage: async (message) => {
    message = parseSqsMessage(message);
    console.log("Processing HD:", message.fileName);
    const hdPath = `${hdBasePath}/${message.fileName}`;
    const command = `ffmpeg -y -i '${message.filePath}' -vf "scale=720:480" '${hdPath}' -loglevel error`;

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
		publishHdFileProcessingStatusToSns(message._id)
		console.log('Finished processing HD:', message._id, message.fileName)
		publishFHDVideoInfoToSns(message._id, message.fileName, message.filePath);
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
