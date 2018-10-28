var Config  = require('../config/config');
var twilio = require('twilio');

var twilio_helper={
    send_sms: function(from, to, sms){

        var result = "ready:";

        var twilio_client =new twilio(Config.twilio_config.accountSid, Config.twilio_config.authToken);
        return twilio_client.messages.create({
            body: sms ,
            to: to,  // Text this number
            from: from // From a valid Twilio number
        });
    }
}


module.exports = twilio_helper;