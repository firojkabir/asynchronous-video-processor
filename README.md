# Asynchronous Video Processor

- Development of a file upload application that implements the operation to upload three different types of files(image, doc, video)
- For video file format, three different sizes of video generate: SD, HD & FHD one by one
- At a time converts one format and after conversion, it starts with the next one
- By this, users don’t need to wait longer to get the output 
- Used localstack to get the flavor of AWS in the local machine
- SQS and SNS topics are used here to get the job done

## sqs & sns

The Amazon `Simple Queue Service (SQS)` and the Amazon `Simple Notification Service (SNS)` are important “glue” components for scalable, cloud-based applications (see the Reference Architectures in the AWS Architecture Center to learn more about how to put them to use in your own applications).

One common design pattern is called “fanout.” In this pattern, a message published to an SNS topic is distributed to a number of SQS queues in parallel. By using this pattern, you can build applications that take advantage of parallel, asynchronous processing. For example, you could publish a message to a topic every time a new image is uploaded. Independent processes, each reading from a separate SQS queue, could generate thumbnails, perform image recognition, and store metadata about the image:

![Alt text](image.png)

[Source: Amazon](https://aws.amazon.com/blogs/aws/queues-and-notifications-now-best-friends/)
