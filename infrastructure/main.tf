provider "aws" {
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  region = "eu-west-1"
}

# topic
resource "aws_sns_topic" "start-sd" {
  name = "start-sd"
}

resource "aws_sns_topic" "start-hd" {
  name = "start-hd"
}

resource "aws_sns_topic" "start-fhd" {
  name = "start-fhd"
}

resource "aws_sns_topic" "video-processed" {
  name = "video-processed"
}

resource "aws_sns_topic" "file-uploaded" {
  name = "file-uploaded"
}

# queue
resource "aws_sqs_queue" "sd-processor" {
  name = "sd-processor"
}

resource "aws_sqs_queue" "hd-processor" {
  name = "hd-processor"
}

resource "aws_sqs_queue" "fhd-processor" {
  name = "fhd-processor"
}

resource "aws_sqs_queue" "file-status-queue" {
  name = "file-status-queue"
}

resource "aws_sqs_queue" "thumbnail-processor" {
  name = "thumbnail-processor"
}

resource "aws_sns_topic_subscription" "thumbnail_processor_subscription" {
  protocol = "sqs"
  topic_arn = aws_sns_topic.file-uploaded.arn
  endpoint = aws_sqs_queue.thumbnail-processor.arn
  filter_policy = "{\"type\": [\"image\"]}"
}

resource "aws_sns_topic_subscription" "sd_processor_subscription" {
  protocol = "sqs"
  topic_arn = aws_sns_topic.start-sd.arn
  endpoint = aws_sqs_queue.sd-processor.arn
}

resource "aws_sns_topic_subscription" "hd_processor_subscription" {
  protocol = "sqs"
  topic_arn = aws_sns_topic.start-hd.arn
  endpoint = aws_sqs_queue.hd-processor.arn
}

resource "aws_sns_topic_subscription" "fhd_processor_subscription" {
  protocol = "sqs"
  topic_arn = aws_sns_topic.start-fhd.arn
  endpoint = aws_sqs_queue.fhd-processor.arn
}

resource "aws_sns_topic_subscription" "file_status_queue_subscription" {
  protocol = "sqs"
  topic_arn = aws_sns_topic.video-processed.arn
  endpoint = aws_sqs_queue.file-status-queue.arn
}

