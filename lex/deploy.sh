#!/bin/bash
REGION=us-east-1
aws iam create-service-linked-role --aws-service-name lex.amazonaws.com
aws lex-models put-intent --region ${REGION} --name medicalmobileiotwithawsintent --cli-input-json file://medical-mobile-iot-with-aws-intent.json
aws lex-models put-bot --region ${REGION} --name medicalmobileiotwithawsbot --cli-input-json file://medical-mobile-iot-with-aws-bot.json
