var AWS = require('aws-sdk');
import { Context, SQSEvent } from 'aws-lambda';

// Set region
AWS.config.update({ region: 'us-east-2' });

exports.handler = async function (event :SQSEvent, context : Context) {

    // Get message from SQS
    event.Records.forEach(record => {
        const { body } = record;
        console.log(body);
    });

    // Scan for flagged words

    // Create publish parameters
    var params = {
        Message: 'MESSAGE_TEXT',    /* TODO */
        TopicArn: 'TOPIC_ARN'       /* TODO */
    };

    // Create promise and SNS service object
    //var promise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

    // Handle promise's fulfilled/rejected states
    /*promise.then(
    function(data) {
        console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
        console.log("MessageID is " + data.MessageId);
    }).catch(
        function(err) {
        console.error(err, err.stack);
    });*/

    return {"Status": "Success"};                  /* TODO */
}

  