var Alexa = require('alexa-sdk');

exports.handler = function(event, context) {
  var alexa = Alexa.handler(event, context);

  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function() { //Executes when a new session is launched
    this.emit('LaunchIntent');
  },

  'LaunchIntent': function() {
    this.emit(':ask', 'Hi, what is your number?');
  },

  'NumberIntent': function() {
    this.attributes['myNumber'] = this.event.request.intent.slots.myNumber.value;
    this.emit(':ask', 'Okay, I got it.');
  },

  'TestIntent': function() {
    if (!this.attributes.myNumber) this.emit(':tell', 'I don\'t remember you telling me a number');
    this.emit(':tell', 'I still remember that your number is, ' + this.attributes['myNumber'].toString());
  }
};
