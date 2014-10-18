var express = require('express');
var bodyParser = require('body-parser');
var conf = require('./conf.js').conf;
var app = express();

// Configure the app
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies

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
    var timestamp = req.body.timestamp;
    var from = req.body.from;
    var to = req.body.to;
    var mood = req.body.mood;

    alarms.push({
        timestamp: timestamp,
        from: from,
        to: to,
        mood: mood
    });

    res.send({detail: 'Alarm set sleepy head!'});
}

app.get('/', index);
app.get('/v1/alarms/', authenticate, getAlarms);
app.post('/v1/alarms/', authenticate, postAlarm);

var server = app.listen(process.env.PORT || 8000, function(){
    console.log('Wake me up before you go go!');
});

