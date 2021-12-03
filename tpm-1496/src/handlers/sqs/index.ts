var AWS = require('aws-sdk');
import { Context, SNSMessage, SQSEvent } from 'aws-lambda';

// Set region
AWS.config.update({ region: 'us-east-2' });

interface InputMsg{
    productID: string
    textFields: Array<object>
}

interface OutputMsg{
    productID: string
    flaggedWords: Array<string>
}

exports.handler = async function (event: SQSEvent, context: Context) {
    let outputMsg: OutputMsg[] = [];
    let flaggedWordsArr =  process.env.FLAGGED_WORD_LIST.split(",");
    console.log("Input Message: "+JSON.stringify(event));
    // Get message from SQS
    event.Records.forEach(record => {
        let inputMsg: InputMsg = JSON.parse(record.body);
        //Scan for flagged 
        let text: string = JSON.stringify(inputMsg.textFields).toLowerCase();
        console.log("Input Text: "+text);
        let flaggedWords: string[] = flaggedWordsArr.filter(v => text.includes(v));
        if (flaggedWords.length > 0) {
            let o: OutputMsg = { productID: inputMsg.productID, flaggedWords: flaggedWords };
            outputMsg.push(o);
        }
    });

    let outputMsgJson: string = JSON.stringify(outputMsg);
    console.log("Output Text: "+outputMsgJson);

    if (outputMsg.length > 0) {
        // Create publish parameters
        var params = {
            Message: outputMsgJson,
            TopicArn: process.env.TOPIC_ARN
        };

        let response = {
            statusCode: 200,
            messageId: "N/A",
            result: "N/A"
        };
        try {
            // Create promise and SNS service object
            var sns = new AWS.SNS({ apiVersion: '2010-03-31' });
            const data = await sns.publish(params).promise();
            response.messageId = data.MessageId,
            response.result = 'Success'
        } catch (err) {
            console.error(err);
            response.result = 'Error'
        }
        console.log("Response: "+JSON.stringify(response));
        return response;
    }
}

  