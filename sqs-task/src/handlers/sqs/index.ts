import { SQSEvent } from 'aws-lambda';
import SNS = require('aws-sdk/clients/sns');

// Init SNS client
const snsClient = new SNS({ region: 'us-east-2' });

interface InputMsg{
    productID: string
    textFields: Array<object>
}

interface OutputMsg{
    productID: string
    flaggedWords: Array<string>
}

interface Response{
    statusCode: number,
    failedIDs: Array<string>
    result: string
}

export const handler = async (event: SQSEvent): Promise<Response> => {
    var publishBatchRequestEntries: SNS.PublishBatchRequestEntry[] = [];
    var flaggedWordsArr = process.env.FLAGGED_WORD_LIST.split(",");
    console.log("Input Message: " + JSON.stringify(event));
    // Get message from SQS
    event.Records.forEach(record => {
        let inputMsg: InputMsg = JSON.parse(record.body);
        //Scan for flagged 
        let text: string = JSON.stringify(inputMsg.textFields).toLowerCase();
        let flaggedWords: string[] = flaggedWordsArr.filter(v => text.includes(v));
        if (flaggedWords.length > 0) {
            let o: OutputMsg = { productID: inputMsg.productID, flaggedWords: flaggedWords };
            let p: SNS.PublishBatchRequestEntry = { Id: '_' + inputMsg.productID+'_' + Math.random().toString(36).substr(2, 5), Message: JSON.stringify(o) }
            publishBatchRequestEntries.push(p);
        }
    });
    let failed:Array<string> = [];
    let response: Response = { statusCode: 200, result: 'Success', failedIDs: failed }
    if (publishBatchRequestEntries.length > 0) {

        while (publishBatchRequestEntries.length) {
            try {
                // Create publish parameters
                // Using SNS batch API. 10 messages at a time.
                let pubBatch = publishBatchRequestEntries.splice(0, 10);
                let pubBatchInput: SNS.PublishBatchInput = { PublishBatchRequestEntries: pubBatch, TopicArn: process.env.TOPIC_ARN }
                let data: SNS.PublishBatchResponse = await snsClient.publishBatch(pubBatchInput).promise();

                // collect failed ids
                if (data.Failed && data.Failed.length >0 ){
                    const lst:SNS.BatchResultErrorEntryList  = data.Failed;
                    let ids: Array<string> = lst.map(e => (e.Id === undefined ? "" : e.Id));
                    failed = failed.concat(ids)
                }
            } catch (err) {
                console.error(err);
                response.result = 'Error.Please check logs.'
            }
        }
        response.failedIDs = failed;
        console.log("Response: " + JSON.stringify(response));
    }
    return response;
}

  