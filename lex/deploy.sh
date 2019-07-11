#!/bin/bash
REGION=us-east-1
aws iam create-service-linked-role --aws-service-name lex.amazonaws.com
aws lex-models put-intent --region ${REGION} --name GuardianAngel --cli-input-json file://guardian_angel_intent.json
aws lex-models put-bot --region ${REGION} --name GuardianAngel --cli-input-json file://guardian_angel_bot.json
