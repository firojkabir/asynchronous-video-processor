const { exec } = require("child_process")
const { Consumer } = require("sqs-consumer")
const { publishSdFileProcessingStatusToSnsTopic, publishHDVideoInfoToSns } = require('./sns-util')

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...")
});

const queueURL = process.env.SQS_SD_PROCESSOR
const sdBasePath = "/home/rimon/Desktop/files/sd"

const parseSqsMessage = (message) => {
  const parsedMessage = JSON.parse(JSON.parse(message.Body).Message)
  parsedMessage.messageId = message.MessageId

  return parsedMessage;
};

const app = Consumer.create({
  queueUrl: queueURL,
  handleMessage: async (message) => {
    message = parseSqsMessage(message)
    console.log("Processing SD:", message.fileName)
	const sdPath = `${sdBasePath}/${message.fileName}`
	const command = `ffmpeg -y -i '${message.filePath}' -vf "scale=480:320" '${sdPath}' -loglevel error`

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
		  publishSdFileProcessingStatusToSnsTopic(message._id)
		  console.log('Finished processing SD:', message._id, message.fileName)
		  publishHDVideoInfoToSns(message._id, message.fileName, message.filePath);
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

console.log("AWS_ENDPOINT", process.env.AWS_ENDPOINT)
