// const soap = require('soap');
// const URL = 'https://lite.realtime.nationalrail.co.uk/OpenLDBWS/ldb9.asmx';
const Darwin = require('national-rail-darwin')
const rail = new Darwin();
// const axios = require('axios');

const renderAsSentence = ({ destination: { name }, std, etd }) => {
  let outputString = `<s>The ${std} service to ${name} is `;
  if (etd === 'On time') {
    outputString += 'running on time';
  } else if (etd === 'Cancelled') {
    outputString += 'cancelled';
  } else if (etd === 'Delayed') {
    outputString += 'indefinitely delayed';
  } else {
    outputString += `is delayed and expected at ${etd}`;
  }
  outputString += '</s>';
  return outputString;
};

rail.getDepartureBoard('AHD', {}, function(err, result){
  if (err) console.log(err);
  const speechResponse = '<speak>'
  + result.trainServices.filter(service => service.destination.crs === 'WAT' || service.destination.crs === 'VIC').map(renderAsSentence).join(' ')
  + '</speak>';
  console.log(speechResponse);
});

// console.log(process.env.DARWIN_TOKEN);
//
// const toLondonArgs = {
//   _xml: `<?xml version="1.0"?>
// <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://thalesgroup.com/RTTI/2014-02-20/ldb/" xmlns:ns2="http://thalesgroup.com/RTTI/2010-11-01/ldb/commontypes">
//   <SOAP-ENV:Header>
//     <ns2:AccessToken>
//       <ns2:TokenValue>${process.env.DARWIN_TOKEN}</ns2:TokenValue>
//     </ns2:AccessToken>
//   </SOAP-ENV:Header>
//   <SOAP-ENV:Body>
//     <ns1:GetDepartureBoardRequest>
//       <ns1:numRows>10</ns1:numRows>
//       <ns1:crs>AHD</ns1:crs>
//     </ns1:GetDepartureBoardRequest>
//   </SOAP-ENV:Body>
// </SOAP-ENV:Envelope>`
// };
//
// soap.createClientAsync(URL).then((client) => {
//   console.log('last request: ', client.lastRequest);
//   return client.GetDepartureBoardRequest(toLondonArgs, (err, res) => {
//     console.log(res);
//   });
//   // this.emit(':tell', 'This is where I will tell you the train times into London');
// });
