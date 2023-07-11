const { sendMessage } = require('./lib')

let message, messageAttributes

message = { 
	fileName: 'nature.jpg', 
	fileType: 'image' 
}

messageAttributes = {
	'type': {
		DataType: 'String',
		StringValue: 'image'
	}
}

sendMessage(message, messageAttributes)

message = { 
	fileName: 'tutorial.mp4', 
	fileType: 'video' 
}

messageAttributes = {
	'type': {
		DataType: 'String',
		StringValue: 'video'
	}
}

// sendMessage(message, messageAttributes)

message = {
	fileName: 'report.docx',
	fileType: 'document'
}

messageAttributes = {
	'type': {
		DataType: 'String',
		StringValue: 'document'
	}
}

// sendMessage(message, messageAttributes)
