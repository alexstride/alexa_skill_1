var Alexa = require('alexa-sdk');
const Darwin = require('national-rail-darwin');
const rail = new Darwin();

exports.handler = function(event, context) {
  var alexa = Alexa.handler(event, context);

  alexa.registerHandlers(handlers);
  alexa.execute();
};

const renderAsSentence = ({ destination: { name }, std, etd }) => {
  let outputString = `<s>The ${std} to ${name} is `;
  if (etd === 'On time') {
    outputString += 'running on time';
  } else if (etd === 'Cancelled') {
    outputString += 'cancelled';
  } else if (etd === 'Delayed') {
    outputString += 'indefinitely delayed';
  } else {
    outputString += `delayed and expected at ${etd}`;
  }
  outputString += '</s>';
  return outputString;
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
    const boundEmit = this.emit.bind(this);
    // this.attributes['myNumber'] = this.event.request.intent.slots.myNumber.value;
    rail.getDepartureBoard('AHD', {}, function(err, result){
      if (err) {
        console.log(err.body);
        boundEmit('SessionEndedIntent');
      }
      const speechResponse = result.trainServices.filter(service => service.destination.crs === 'WAT' || service.destination.crs === 'VIC').slice(0, 4).map(renderAsSentence).join(' ');
      boundEmit(':tell', speechResponse);
    });
  },

  'ArrivalsFromLondonIntent': function() {
    this.emit(':tell', 'This is where I will tell you the train times for arrivals from London');
  }
};
