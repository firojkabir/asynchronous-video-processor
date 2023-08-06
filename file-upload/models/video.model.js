const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  sd: {
    type: Boolean,
	default: false
  },
  hd: {
    type: Boolean,
	default: false
  },
  fhd: {
    type: Boolean,
	default: false
  },
});

const Video = mongoose.model("Video", VideoSchema);

module.exports = { Video };
