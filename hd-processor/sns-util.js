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

const publishHdFileProcessingStatusToSns = (_id) => {
  const topicArn = "arn:aws:sns:eu-west-1:000000000000:video-processed";
  const message = { _id: _id, type: 'hd' };

  sendMessageToSns(topicArn, message);
};

const publishFHDVideoInfoToSns = (_id, fileName, filePath) => {
	const topicArn = "arn:aws:sns:eu-west-1:000000000000:start-fhd";
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
	publishHdFileProcessingStatusToSns,
	publishFHDVideoInfoToSns
};
