var express = require('express');
var bodyParser = require('body-parser');
var conf = require('./conf.js').conf;
var app = express();

// Configure the app
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies

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
    res.send({
        items: []
    });
}

function postAlarm(req, res){
    res.send({detail: 'thanks sleepy head'});
}

app.get('/', index);
app.get('/v1/alarms/', authenticate, getAlarms);
app.post('/v1/alarms/', authenticate, postAlarm);

var server = app.listen(process.env.PORT || 8000, function(){
    console.log('Wake me up before you go go!');
});

