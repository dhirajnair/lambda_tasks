HTTP API

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

## Cleanup

1. Once done clean up all resources with below command

`sam delete <stack-name>`
