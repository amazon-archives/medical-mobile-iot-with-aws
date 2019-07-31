#!/bin/bash
REGION=us-east-1
aws iam create-service-linked-role --aws-service-name lex.amazonaws.com
aws lex-models put-intent --region ${REGION} --name medical-mobile-iot-with-aws-intent --cli-input-json file://medical-mobile-iot-with-aws-intent.json
aws lex-models put-bot --region ${REGION} --name medical-mobile-iot-with-aws-bot --cli-input-json file://medical-mobile-iot-with-aws-bot.json
