# apk add terraform
# pip3 install terraform-local
# cd /docker-entrypoint-initaws.d
# tflocal init
# tflocal apply -auto-approve




# awslocal --endpoint-url=http://${LOCALSTACK_HOSTNAME}:4566 --region=eu-west-1 sqs create-queue --queue-name sd-processor
# awslocal --endpoint-url=http://${LOCALSTACK_HOSTNAME}:4566 --region=eu-west-1 sqs create-queue --queue-name hd-processor
# awslocal --endpoint-url=http://${LOCALSTACK_HOSTNAME}:4566 --region=eu-west-1 sqs create-queue --queue-name fhd-processor
# awslocal --endpoint-url=http://${LOCALSTACK_HOSTNAME}:4566 --region=eu-west-1 sqs create-queue --queue-name thumbnail-processor
# awslocal --endpoint-url=http://${LOCALSTACK_HOSTNAME}:4566 --region=eu-west-1 sqs create-queue --queue-name file-status-queue

# awslocal --endpoint-url=http://${LOCALSTACK_HOSTNAME}:4566 --region=eu-west-1 sns create-topic --name file-uploaded
# awslocal --endpoint-url=http://${LOCALSTACK_HOSTNAME}:4566 --region=eu-west-1 sns create-topic --name start-sd
# awslocal --endpoint-url=http://${LOCALSTACK_HOSTNAME}:4566 --region=eu-west-1 sns create-topic --name start-hd
# awslocal --endpoint-url=http://${LOCALSTACK_HOSTNAME}:4566 --region=eu-west-1 sns create-topic --name start-fhd
# awslocal --endpoint-url=http://${LOCALSTACK_HOSTNAME}:4566 --region=eu-west-1 sns create-topic --name video-processed

# awslocal sns subscribe \
# 	--topic-arn arn:aws:sns:eu-west-1:000000000000:file-uploaded \
# 	--protocol sqs \
# 	--notification-endpoint http://${LOCALSTACK_HOSTNAME}:4566/queue/thumbnail-processor \
# 	--attributes "{\"FilterPolicy\": \"{\\\"type\\\": [\\\"image\\\"]}\"}"

# awslocal sns subscribe \
# 	--topic-arn arn:aws:sns:eu-west-1:000000000000:start-sd \
# 	--protocol sqs \
# 	--notification-endpoint http://${LOCALSTACK_HOSTNAME}:4566/queue/sd-processor

# awslocal sns subscribe \
# 	--topic-arn arn:aws:sns:eu-west-1:000000000000:start-hd \
# 	--protocol sqs \
# 	--notification-endpoint http://${LOCALSTACK_HOSTNAME}:4566/queue/hd-processor

# awslocal sns subscribe \
# 	--topic-arn arn:aws:sns:eu-west-1:000000000000:start-fhd \
# 	--protocol sqs \
# 	--notification-endpoint http://${LOCALSTACK_HOSTNAME}:4566/queue/fhd-processor

# awslocal sns subscribe \
# 	--topic-arn arn:aws:sns:eu-west-1:000000000000:video-processed \
# 	--protocol sqs \
# 	--notification-endpoint http://${LOCALSTACK_HOSTNAME}:4566/queue/file-status-queue
