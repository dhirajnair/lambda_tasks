# TPM-1496 Queue Processor Task

## Pre-requisites

1. aws cli / sam cli / webpack / npm / node must be installed.
2. aws credentils file must be setup.

## Commands

1. Compile: `npm run webpack`
2. Package: `sam package --s3-bucket <bucket-name>` (ex: `sam package --s3-bucket tpm-1496`)
3. Deploy: `sam deploy --guided`   (Only once to generate `samconfig.toml`)

Once the deployment is configured, the whole process can be executed in one line:

```
npm run webpack && sam package --s3-bucket <bucket-name> && sam deploy
```

## Test

 1. Get SNS topic arn using below command.

  `aws sns list-topics|grep -i tpm`

 2. Create email subscription to topic using below command, using topic arn from above.

 `aws sns subscribe --topic-arn <topic arn> --protocol email --notification-endpoint <email>`

 3. Test function using below command.

 `aws lambda invoke --function-name TPM1496Function --cli-binary-format raw-in-base64-out --payload file://input.json /tmp/outputfile.txt`


## Cleanup

1. Once done clean up all resources with below command

`sam delete <stack-name>`