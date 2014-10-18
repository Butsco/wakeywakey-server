var Parse = require('parse').Parse;

// Initialize Parse
Parse.initialize("NSewYOEI4QaUs2xciFygsBLJp15I4VtMW2y4F1h6", "5pPyLMmCaacLMJn9dJEHyDeO6uIovSgGiBot12ti");

var Alarm = Parse.Object.extend("Alarm");

/*
    data.storeAlarm({
        timestamp: timestamp,
        from: from,
        fromName: fromName,
        to: to,
        mood: mood
    });
 */
function storeAlarm(data){
    data['status'] = 'new';

    function store(alarmObj){
        alarmObj.save(data, {
            success: function(a, error){
                console.log("Alarm stored");
            },
            error: function(a, error){
                console.log("Couldnt store Alarm ");
                console.log(error);
            }
        });
    }

    var query = new Parse.Query(Alarm);
    query.equalTo("from", data['from']);
    query.equalTo("timestamp", data['timestamp']);
    query.first({
        success: function(object){
            if(!object){
                object = new Alarm();
            }
            store(object);
        },
        error: function(error){
            console.log("Could not set alarm");
        }
    });
}

function toExecute(callback){
    var query = new Parse.Query(Alarm);
    query.equalTo('status', 'new');
    query.find({
        success: function(results){
            callback(results);
        },
        error: function(error){
            console.log("Damned " + error);
        }
    });
}

exports.data = {
    storeAlarm: storeAlarm,
    toExecute: toExecute
};
