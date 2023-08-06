const fs = require("fs");
const { sendMessage } = require("./lib");

const imageDirectory = "/home/rimon/Desktop/files/images";

fs.readdirSync(imageDirectory).forEach((fileName) => {
  console.log(fileName);

  const message = {
    fileName: fileName,
    fileType: "image",
  };

  const messageAttributes = {
    type: {
      DataType: "String",
      StringValue: "image",
    },
  };

  sendMessage(message, messageAttributes);
});
