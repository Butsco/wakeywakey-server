var twilio = require('twilio');
var config = require('./conf.js').config;

var client = new twilio.RestClient(config.twilio.sid, config.twilio.secret);

/**
 * https://www.twilio.com/blog/2013/03/introducing-the-twilio-module-for-node-js.html
 *
 * @param to
 * @param message
 */
function sendSMS(to, message){
    var wakeyFrom = config.twilio.from;

    client.sms.messages.create({
        to: to,
        from: wakeyFrom,
        body: message
    }, function(error, message) {
        // The HTTP request to Twilio will run asynchronously. This callback
        // function will be called when a response is received from Twilio
        // The "error" variable will contain error information, if any.
        // If the request was successful, this value will be "falsy"
        if (!error) {
            // The second argument to the callback will contain the information
            // sent back by Twilio for the request. In this case, it is the
            // information about the text messsage you just sent:
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);

            console.log('Message sent on:');
            console.log(message.dateCreated);
        } else {
            console.log('Oops! There was an error.');
            console.log(error);
        }
    });
}

/**
 * Alarm: {timestamp: timestamp, from: from, fromName: fromName, to: to, mood: mood }
 */
function setupCall(msisdnFrom, msisdnTo){
    var wakeyFrom = config.twilio.from;
    var from = msisdnFrom.replace('+', '%2B');
    var initiateUrl = config.rootUrl + "/v1/scripts/initiate.xml?access_token=wham&from=" + from;
    console.log("Initiate url " + initiateUrl);

    client.calls.create({
        //url: "https://wakeywakey.localtunnel.me/twilioscripts/juicy.xml",
        //url: "http://wakeywakey.dance/twilioscripts/initiate.xml",
        url: initiateUrl,
        to: msisdnTo,
        from: wakeyFrom,
        method: 'GET'
    }, function(err, call) {
        //process.stdout.write(call.sid);

        if(!err){
            console.log("\nCall started: " + call.sid);
        } else {
            console.log("Error: ");
            console.log(err);
        }
    });
}

exports.service = {
    sendSMS: sendSMS,
    setupCall: setupCall
};
