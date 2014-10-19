/*
SID: PN3095d7bb628912300f7dfc7d43048548
Number: +19073122029
Capabilities: Voice, SMS, MMS
 */
var config = {
    rootUrl: 'https://wakeywakey.localtunnel.me',

    testers: {
        maarten: '+32470876752',
        bert: '+32474418798'
    },

    twilio: {
        from: '+19073122029',

        // Test credentials
        //sid: 'AC7b47e6b6ff3a1404ec834ece10f563b9',
        //secret: 'aef8c01ab53917ef7f433de96f0aa0d7'

        // Production credentials
        sid: 'AC614f57999419a695c8da55ab02bbfbfa',
        secret: '7a9b0cb161930c0763a51b8eaf799ae8'
    }
};

// If process.env.PORT is set the app is deployed on ElasticBeanstalk
if(process.env.PORT || true){
    config.rootUrl = 'http://wakey-env.elasticbeanstalk.com'
}

console.log("Config: " + process.env.PORT);
exports.config = config;
