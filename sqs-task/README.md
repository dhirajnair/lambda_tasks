# Lambda Typescript & CloudFormation Boilerplate

TODO Update this README file with your own solution's title and details.

## Commands

1. Compile: `npm run webpack`
2. Package: `sam package --s3-bucket <bucket-name>`
3. Deploy: `sam deploy`

**Boilerplate note** Each time you use this boilerplate, you should run `sam deploy --guided`, which will ask some questions and then create a `samconfig.toml` file.  After this you can use `sam deploy` and it will use the values in the file.  You can override the settings in the file by specifying `--guided`.

Once the deployment is configured, the whole process can be executed in one line:

```
npm run webpack && sam package --s3-bucket <bucket-name> && sam deploy
```

## Usage

TODO Add usage instructions for your own solution.
