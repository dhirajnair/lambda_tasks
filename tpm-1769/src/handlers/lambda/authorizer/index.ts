import {  APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent, PolicyDocument } from "aws-lambda";
const access_key = process.env.ACCESS_KEY

export async function handler(event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> {
    const key = event.queryStringParameters?.access_key;
  
    const policyDocument: PolicyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: key === access_key ? 'Allow' : 'Deny',
          Resource: 'arn:aws:execute-api:us-east-1:*:*',
        },
      ],
    };
  
    return {
      policyDocument,
      principalId: 'apigateway.amazonaws.com',
    };
  }


  