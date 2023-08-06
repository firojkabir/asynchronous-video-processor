const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-1" });

const sns = new AWS.SNS({ endpoint: "http://localhost:4566" });

function sendMessage(message, messageAttributes = {}) {
  const params = {
    TopicArn: "arn:aws:sns:eu-west-1:000000000000:file-uploaded",
    Message: JSON.stringify(message),
	MessageAttributes: messageAttributes
  };

  sns.publish(params, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(data);
  });
}

module.exports = { sendMessage }
