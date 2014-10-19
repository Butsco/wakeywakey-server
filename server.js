var express = require('express');
var bodyParser = require('body-parser');
var config = require('./conf.js').config;
var service = require('./service.js').service;
var data = require('./data.js').data;
var schedule = require('node-schedule');
var app = express();

// Configure the app
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies
app.use(express.static(__dirname + '/static'));

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

    data.toExecute(function(results){
        res.send({
            count: results.length,
            items: results
        });
    });
}

/**
 * Receiving the following parameters:
 *  - timestamp: int timestamp in seconds
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

    // This looks a bit weird but this is to avoid decimals and Parse only accepts a string for this value
    var timestamp = parseInt(req.body.timestamp).toString();
    var from = format(req.body.from);
    var fromName = req.body.fromName;
    var to = format(req.body.to);
    var mood = req.body.mood;

    data.storeAlarm({
        timestamp: timestamp,
        from: from,
        fromName: fromName,
        to: to,
        mood: mood
    });

    var newDate = new Date();
    newDate.setTime(parseInt(req.body.timestamp) * 1000);
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
function script(req, res){
    var from = req.query["from"];
    var fromName = req.query['fromName'];
    console.log("Script requested: " + from);

    var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<Response>' +
        '<Say voice="alice">' + fromName + ' want\'s you to wake him up now, we\'ll start calling him</Say>' +
        '<Dial record="true"><Number>' + from + '</Number></Dial>' +
        '</Response>';

    res.setHeader("Content-Type", "text/xml");
    res.send(xml);
}

/**
 * Fetches the un-executed alarms from Parse and will execute the ones that are scheduled at the moment that this job is
 * executed. It will setup the call between the bro's.
 */
function job(){
    var date = new Date();
    var timestampNow = date.getTime()/1000; // Timestamp in seconds
    console.log("Job started at " + date.toUTCString());

    data.toExecute(function(results){
        console.log("Items to execute: " + results.length);

        for(var i=0; i<results.length; i++){
            var alarm = results[i];
            var timestampAlarm = alarm.get('timestamp');
            var diff = timestampAlarm - timestampNow;
            console.log("Diff: " + diff);

            // 2 minutes drift
            if(diff > -60 && diff < 60){
                console.log("Execute Alarm: " + alarm.id);
                service.setupCall(alarm.get('from'), alarm.get('fromName'), alarm.get('to'));   // Initiate call
                alarm.set('status', 'executed');
                alarm.save();
            } else if(diff < -60) {
                console.log("Alarm to old: " + alarm.id);
                alarm.set('status', 'toOld');
                alarm.save();
            } else {
                console.log("Hmmm: " + alarm.id);
            }
        }

        date = new Date();
        console.log("Job executed at " + date.toUTCString() + "\n");
    });
}

// Configure URLS
app.get('/', index);
app.get('/v1/alarms/', authenticate, getAlarms);
app.post('/v1/alarms/', authenticate, postAlarm);
app.get('/v1/scripts/initiate.xml', authenticate, script);
app.get('/v1/nexmocallback/', function(req, res){
    //https://rest.nexmo.com/ni/json?api_key=1b7171f6&api_secret=2313a132&number=32470876752&features=carrier,roaming,reachable,ported&callback=https://wakeywakey.localtunnel.me/v1/nexmocallback/
    //https://rest.nexmo.com/ni/json?api_key=1b7171f6&api_secret=2313a132&number=32470876752&features=type,valid,subscriber,carrier,roaming,reachable,ported&callback=https://wakeywakey.localtunnel.me/v1/nexmocallback/
    //https://rest.nexmo.com/ni/json?api_key=1b7171f6&api_secret=2313a132&number=32476744989&features=type,valid,subscriber,carrier,roaming,reachable,ported&callback=https://wakeywakey.localtunnel.me/v1/nexmocallback/
    console.log('Bam jong: ');
    console.log(req.query);
    res.send({detail: "test"});
});

// Setup server
var server = app.listen(process.env.PORT || 8000, function(){
    console.log('Wake me up before you go go!');
    console.log("Started at " + new Date().toUTCString() + "\n");
});

/**
 * Start scheduler and execute the job every minute
 */
var rule1 = new schedule.RecurrenceRule();
rule1.second = 0;
schedule.scheduleJob(rule1, job);

//var rule2 = new schedule.RecurrenceRule();
//rule2.second = 30;
//schedule.scheduleJob(rule2, job);

//service.sendSMS('+32470876752', 'bam chinees jongeuh');       // Maarten
//service.sendSMS('+32474418798', 'bam chinees jongeuh');       // Bert
