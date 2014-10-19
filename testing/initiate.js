var conf = require('./../conf.js').config;
var service = require('./../service.js').service;

service.setupCall(conf.testers.bert, 'Bert', conf.testers.maarten);
