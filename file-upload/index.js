require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const { Consumer } = require("sqs-consumer");
const {
  publishAvatarInfoToSns,
  publishSDVideoInfoToSns,
} = require("./sns-util");
const { Video } = require("./models/video.model");

const app = express();

const UPLOADS_FOLDER = "./uploads/";

const parseSqsMessage = (message) => {
  const parsedMessage = JSON.parse(JSON.parse(message.Body).Message);
  parsedMessage.messageId = message.MessageId;

  return parsedMessage;
};

const queueURL = "http://localhost:4566/queue/file-status-queue";

const queue = Consumer.create({
  queueUrl: queueURL,
  handleMessage: async (message) => {
    message = parseSqsMessage(message);
    console.log(message);
    await Video.findByIdAndUpdate(message._id, { [message.type]: true });
  },
});

mongoose.connect(process.env.DB_URL).then(
  () => {
    console.log("DB connected");
    queue.start();
  },
  (err) => {
    console.log("DB connection failed");
  }
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    cb(null, fileName + fileExt);
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Only .png, .jpg or .jpeg format allowed in the image input"
          )
        );
      }
    } else if (file.fieldname === "doc") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Only .pdf format allowed in the document input"));
      }
    } else if (file.fieldname === "video") {
      if (file.mimetype === "video/mp4") {
        cb(null, true);
      } else {
        cb(new Error("Only .mp4 format allowed in the video input"));
      }
    } else {
      cb(new Error("There was an error"));
    }
  },
});

app.use(cors());
app.use(express.json());

app.post(
  "/",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "doc", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    if (Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
      const fileName = req.files.avatar[0].filename;
      const filePath = `${__dirname}/${req.files.avatar[0].path}`;

      publishAvatarInfoToSns(fileName, filePath);
    }

    if (Array.isArray(req.files.video) && req.files.video.length > 0) {
      const fileName = req.files.video[0].filename;
      const filePath = `${__dirname}/${req.files.video[0].path}`;

      let video = new Video({ fileName, filePath });
      video = await video.save();

      publishSDVideoInfoToSns(video._id, video.fileName, video.filePath);
    }

    res.send("File uploaded successfully");
  }
);

app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  } else {
    res.send("success");
  }
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
