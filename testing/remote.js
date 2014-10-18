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


/*

#!/bin/bash

echo "Post a new alarm";
curl http://localhost:8000/v1/alarms/?access_token=wham --data "timestamp=1301090400&from=%2B32474418798&to=%2B32470876752&mood=singing&fromName=Bert Wijnants"

echo "";
echo "";
echo "List alarms";
curl http://localhost:8000/v1/alarms/?access_token=wham
echo "";

*/

/*
var request = require('request');

request.post(
    'http://www.yoursite.com/formpage',
    { form: { key: 'value' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);

 */