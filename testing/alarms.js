var data = require('./../data.js').data;
var config = require('./../conf.js').config;

console.log("Setup some test alarms");
var date = new Date();
var timestampNow = Math.floor(date.getTime()/1000); // Timestamp in seconds

// Schedule an alarm 30 seconds in the future as of from now
var newTimestamp = timestampNow + 60;
data.storeAlarm({
    timestamp: newTimestamp.toString(),
    from: config.testers.bert,
    fromName: 'Bert',
    to: config.testers.maarten,
    mood: 'happy'
});
console.log("Alarm scheduled: " + new Date(newTimestamp*1000).toUTCString() + ", timestamp: " + timestampNow);



/*
var express = require('express');
var bodyParser = require('body-parser');
var conf = require('./conf.js').conf;
var service = require('./service.js').service;
var data = require('./data.js').data;
var schedule = require('node-schedule');
var app = express();

// Configure the app
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies
app.use(express.static(__dirname + '/static'));

 */