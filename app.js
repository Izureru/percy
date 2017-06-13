
var restify = require('restify');
var builder = require('botbuilder');
var get = require('simple-get');

// Setup Restify Server
var server = restify.createServer();
// server.use(restify.queryParser());
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
	const opts = {
  			method: 'GET',
  			url: 'http://askpercy.herokuapp.com/v1/percyp/'+ session.message.text.toLowerCase(),
  			json: true
	}
	get.concat(opts, function (err, res, data) {
  		if (err) throw err
  		console.log(data.explanation) // `data` is an object
  		session.send(data.explanation);
	})
});
