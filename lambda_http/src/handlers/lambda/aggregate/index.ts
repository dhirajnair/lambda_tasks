import { APIGatewayProxyEventV2, APIGatewayProxyResult, DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
const dynamo = new DocumentClient();
const voting_result_table = process.env.VOTING_RESULT_TABLE ;

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    await Promise.all(event.Records.map(async record => {
      if (record.dynamodb?.NewImage?.contestant?.S && record.dynamodb?.NewImage?.year_week?.S) {
        await addVoteToResults(record.dynamodb.NewImage.contestant.S, record.dynamodb.NewImage.year_week.S)
      }
    }))
}

export const addVoteToResults = async (contestant: string, year_week: string) => {
    await dynamo.update({
        TableName: voting_result_table,
        Key: { year_week: year_week,contestant: contestant },
        UpdateExpression: 'add vote :inc',
        ExpressionAttributeValues: {
          ':inc': 1
        }
      }).promise();
}

  