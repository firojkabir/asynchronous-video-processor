const AWS = require("aws-sdk");

const sns = new AWS.SNS({
  endpoint: process.env.AWS_ENDPOINT,
  region: process.env.AWS_REGION,
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

const publishSdFileProcessingStatusToSnsTopic = (_id) => {
  const topicArn = process.env.TOPIC_ARN_VIDEO_PROCESSED;
  const message = { _id: _id, type: 'sd' };

  sendMessageToSns(topicArn, message);
};

const publishHDVideoInfoToSns = (_id, fileName, filePath) => {
	const topicArn = process.env.TOPIC_ARN_START_HD;
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
	publishSdFileProcessingStatusToSnsTopic,
	publishHDVideoInfoToSns
};
