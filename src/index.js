var Alexa = require('alexa-sdk');
const soap = require('soap');

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
    console.log('LAUNCH INTENT FIRING');
    this.emit(':ask', 'How can I help you?');
  },

  'DeparturesToLondonIntent': function() {
    // this.attributes['myNumber'] = this.event.request.intent.slots.myNumber.value;
    this.emit(':tell', 'This is where I will tell you the train times into London');
  },

  'ArrivalsFromLondonIntent': function() {
    this.emit(':tell', 'This is where I will tell you the train times for arrivals from London');
  }
};
