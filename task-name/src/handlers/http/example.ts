import {APIGatewayProxyHandlerV2} from "aws-lambda";


// this an example hanlder for API Gateway HTTP events, you can find the full list of handlers here: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/aws-lambda/trigger
export const get: APIGatewayProxyHandlerV2 = async (event) => {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({ result: true })
  };
};
