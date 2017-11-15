var Alexa = require('alexa-sdk');
const soap = require('soap');
const URL = 'https://lite.realtime.nationalrail.co.uk/OpenLDBWS/ldb6.asmx';

const toLondonArgs = {
  _xml: `<?xml version="1.0"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://thalesgroup.com/RTTI/2014-02-20/ldb/" xmlns:ns2="http://thalesgroup.com/RTTI/2010-11-01/ldb/commontypes">
  <SOAP-ENV:Header>
    <ns2:AccessToken>
      <ns2:TokenValue>${process.env.DARWIN_TOKEN}</ns2:TokenValue>
    </ns2:AccessToken>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body>
    <ns1:GetDepartureBoardRequest>
      <ns1:numRows>10</ns1:numRows>
      <ns1:crs>AHD</ns1:crs>
    </ns1:GetDepartureBoardRequest>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`
};

exports.handler = function(event, context) {
  var alexa = Alexa.handler(event, context);

  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function() { //Executes when a new session is launched
    console.log('LAUNCH REQUEST TRIGGERED');
    this.emit('LaunchIntent');
  },

  'LaunchIntent': function() {
    this.emit(':ask', 'How can I help you?');
  },

  'SessionEndedRequest': function() {
    this.emit('SessionEndedIntent');
  },

  'SessionEndedIntent': function() {
    this.emit(':tell', 'Goodbye');
  },

  'Unhandled': function() {
    this.emit(':ask', 'I didn\'t understand what you said. Try again');
  },

  'DeparturesToLondonIntent': function() {
    // this.attributes['myNumber'] = this.event.request.intent.slots.myNumber.value;
    soap.createClientAsync(URL).then((client) => {
      return client.MyFunctionAsync(toLondonArgs);
    }).then((result) => {
      console.log(result);
      this.emit(':tell', 'This is where I will tell you the train times into London');
    });

  },

  'ArrivalsFromLondonIntent': function() {
    this.emit(':tell', 'This is where I will tell you the train times for arrivals from London');
  }
};
