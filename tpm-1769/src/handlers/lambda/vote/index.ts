import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
const dynamo = new DocumentClient();
const voting_table = process.env.VOTING_TABLE ;
const contestant_list = process.env.CONTESTANT_LIST;
const voting_time_window = process.env.VOTING_TIME_WINDOW;

interface InputMsg{
    first_name: string,
    last_name: string,
    voter: string
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json"
    };

    try {
        switch(event.routeKey){
            case "PUT /vote":
                if(event.body != undefined){
                    let inputMsg: InputMsg = JSON.parse(event.body);
                    let name = inputMsg.first_name.toLowerCase()+"#"+inputMsg.last_name.toLowerCase();
                    let valid_contestant:boolean = contestant_list.split(",").includes(name)? true : false;
                    let valid_time_window:boolean = isValidTimeWindow();
                    console.log("valid_contestant: "+valid_contestant)
                    console.log("valid_time_window: "+valid_time_window)
                    if (valid_contestant && valid_time_window) {
                        const year = new Date().getFullYear();
                        const week = getWeek();
                        let year_week:string = year + "_" + week;
                        console.log("year_week: "+year_week)
                        let voter:string = inputMsg.voter;
                        try {
                            await dynamo
                            .put({
                                TableName: voting_table + "",
                                Item: {
                                    year_week: year_week,
                                    voter: voter,
                                    contestant: name
                                },
                                ConditionExpression: 'attribute_not_exists(year_week) AND attribute_not_exists(voter)'
                            })
                            .promise();
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    body = "Submitted vote";
                }else{
                    throw new Error(`Invalid Input (Body): "${event.body}"`);
                }
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

function isValidTimeWindow(): boolean{
    var startDate = new Date(voting_time_window.split(",")[0]);
    var endDate = new Date(voting_time_window.split(",")[1]);
    var currentDate = new Date();
    return startDate < currentDate && endDate > currentDate;
}

function getWeek(): number{
    const currentdate: Date = new Date()
    const oneJan:Date = new Date(currentdate.getFullYear(),0,1);
    const numberOfDays = Math.floor((Number(currentdate) - Number(oneJan)) / (24 * 60 * 60 * 1000));
    var week:number = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
    return week;
}

  