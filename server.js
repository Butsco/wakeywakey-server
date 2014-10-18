var express = require('express');
var bodyParser = require('body-parser');
var conf = require('./conf.js').conf;
var service = require('./service.js').service;
var app = express();

// Configure the app
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies
app.use(express.static(__dirname + '/static'));

// Alarms stored in memory for now
var alarms = [];

/**
 *
 * @param req
 * @param res
 * @param next
 */
function authenticate(req, res, next){
    console.log("auth");
    var accessToken = req.query['access_token'];

    // TODO: make more secure later on
    if(accessToken !== 'wham'){
        console.log("not authenticated");
        res.status(401);
        res.send({
            "status_code": 401,
            "error": "notauthenticated"
        });
        return;
    }

    next();
}

function index(req, res){
    res.send({detail: 'If a man speaks in the forest and no women hears him, is he still wrong?'});
}

function getAlarms(req, res){
    var items = alarms;

    res.send({
        count: items.length,
        items: items
    });
}

/**
 * Receiving the following parameters:
 *  - timestamp: int timestamp
 *  - from msisdn
 *  - to msisdn
 *  - mood: type of wake up call that you would like to receive
 *    - happy, scary, singing, etc
 *
 * curl http://localhost:8000/v1/alarms/?access_token=wham --data "timestamp=234234&from=32474418798&to=32470876752&mood=singing"
 * curl http://localhost:8000/v1/alarms/?access_token=wham
 *
 * @param req
 * @param res
 */
function postAlarm(req, res){
    function format(msisdn){
        if(msisdn.substring(0, 1) !== '+'){
            return '+' + msisdn;
        }

        return msisdn;
    }

    var timestamp = req.body.timestamp;
    var from = format(req.body.from);
    var fromName = req.body.fromName;
    var to = format(req.body.to);
    var mood = req.body.mood;

    alarms.push({
        timestamp: timestamp,
        from: from,
        fromName: fromName,
        to: to,
        mood: mood
    });

    var newDate = new Date();
    newDate.setTime(timestamp * 1000);
    var formattedDate = newDate.toUTCString();

    var message = fromName + " want's you to wake him/her up at " + formattedDate;
    service.sendSMS(to, message);
    console.log('SMS sent: ' + message);

    res.send({detail: 'Alarm set sleepy head!', message: message});
}

/**
 * https://www.twilio.com/docs/api/twiml/dial
 *
 * @param res
 * @param req
 */
function script(res, req){
    console.log("Script requested");

    var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<Response>' +
        '<Say voice="alice">Bert want\'s you to wake him up now, we\'ll start calling him now</Say>' +
        '<Dial record="true"><Number>+32474418798</Number></Dial>' +
        '<Say voice="alice">Thanks bro</Say>' +
        '</Response>';

    res.setHeader("Content-Type", "text/xml");
    res.send(xml);
}

app.get('/', index);
app.get('/v1/alarms/', authenticate, getAlarms);
app.post('/v1/alarms/', authenticate, postAlarm);
app.post('/v1/scripts/initiate.xml', script);

var server = app.listen(process.env.PORT || 8000, function(){
    console.log('Wake me up before you go go!');
});

//service.sendSMS('+32470876752', 'bam chiness jongeuh');       // Maarten
//service.sendSMS('+32474418798', 'bam chiness jongeuh');       // Bert

setTimeout(function(){
    console.log("setup call");
    service.setupCall();
}, 2000);

//service.setupCall();
