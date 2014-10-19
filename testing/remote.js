var config = require('./../conf.js').config;
var service = require('./../service.js').service;
var request = require('request');

// Schedule an alarm 30 seconds in the future as of from now
var timestamp = Math.floor(new Date().getTime()/1000) + 30;

request.post(
    'http://wakey-env.elasticbeanstalk.com/v1/alarms/?access_token=wham',
    {
        form: {
            timestamp: timestamp.toString(),
            from: config.testers.bert,
            fromName: 'Bert',
            to: config.testers.maarten,
            mood: 'singing'
        }
    },
    function(error, response, body){
        if (!error && response.statusCode == 200) {
            console.log(body)
        } else {
            console.log(error);
        }
    }
);
