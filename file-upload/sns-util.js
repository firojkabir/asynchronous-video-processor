const AWS = require("aws-sdk");

const sns = new AWS.SNS({
  endpoint: "http://localhost:4566",
  region: "eu-west-1",
});

const sendMessageToSns = (topicArn, message, messageAttributes = {}) => {
  const params = {
    TopicArn: topicArn,
    Message: JSON.stringify(message),
    MessageAttributes: messageAttributes,
  };

  sns.publish(params, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  });
};

const publishAvatarInfoToSns = (fileName, filePath) => {
  const topicArn = "arn:aws:sns:eu-west-1:000000000000:file-uploaded";
  const message = { fileName: fileName, filePath: filePath };
  const messageAttributes = {
    type: {
      DataType: "String",
      StringValue: "image",
    },
  };

  sendMessageToSns(topicArn, message, messageAttributes);
};

const publishSDVideoInfoToSns = (_id, fileName, filePath) => {
	const topicArn = "arn:aws:sns:eu-west-1:000000000000:start-sd";
	const message = { _id: _id, fileName: fileName, filePath: filePath };
	const messageAttributes = {
	  type: {
		DataType: "String",
		StringValue: "video",
	  },
	};
  
	sendMessageToSns(topicArn, message, messageAttributes);
  };

module.exports = {
  publishAvatarInfoToSns,
  publishSDVideoInfoToSns
};
