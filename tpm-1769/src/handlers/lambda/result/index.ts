import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
const dynamo = new DocumentClient();
const voting_result_table = process.env.VOTING_RESULT_TABLE;

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json"
    };

    try {
        switch(event.routeKey){
            case "GET /result":
  
                let y = event.queryStringParameters?.year;
                let w = event.queryStringParameters?.week;
                const year = y ? y : new Date().getFullYear();
                const week = w ? w : getWeek();
                const year_week = year + "_" + week;
                body = await dynamo
                    .query({
                        TableName: voting_result_table,
                        KeyConditionExpression: 'year_week = :yw',
                        ExpressionAttributeValues: {
                            ':yw': year_week
                        }
                    })
                    .promise();

                break;

            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }
    } catch (error) {
        statusCode = 400;
        body = error;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
}

function getWeek(){
    const currentdate: Date = new Date()
    const oneJan:Date = new Date(currentdate.getFullYear(),0,1);
    const numberOfDays = Math.floor((Number(currentdate) - Number(oneJan)) / (24 * 60 * 60 * 1000));
    var week = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
    return week;
}

  