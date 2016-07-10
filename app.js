var restify = require('restify');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var config = require('config');
var jwt = require('restify-jwt');
var mongoose = require('mongoose');
var secret = require('dvp-common/Authentication/Secret.js');
var authorization = require('dvp-common/Authentication/Authorization.js');
var engagementService = require('./Services/EngagementService');
var util = require('util');
var port = config.Host.port || 3000;
var host = config.Host.vdomain || 'localhost';


var server = restify.createServer({
    name: "DVP Engagement Service"
});

server.pre(restify.pre.userAgentConnection());
server.use(restify.bodyParser({ mapParams: false }));

restify.CORS.ALLOW_HEADERS.push('authorization');
server.use(restify.CORS());
server.use(restify.fullResponse());

server.use(jwt({secret: secret.Secret}));


var mongoip=config.Mongo.ip;
var mongoport=config.Mongo.port;
var mongodb=config.Mongo.dbname;
var mongouser=config.Mongo.user;
var mongopass = config.Mongo.password;



var mongoose = require('mongoose');
var connectionstring = util.format('mongodb://%s:%s@%s:%d/%s',mongouser,mongopass,mongoip,mongoport,mongodb)


mongoose.connection.on('error', function (err) {
    throw new Error(err);
});

mongoose.connection.on('disconnected', function() {
    throw new Error('Could not connect to database');
});

mongoose.connection.once('open', function() {
    console.log("Connected to db");
});


mongoose.connect(connectionstring);


///////////////////////////////Engagement////////////////////////////////////////////////////////////////////////////////////////////

server.get('/DVP/API/:version/Engagements', authorization({resource:"engagement", action:"read"}), engagementService.GetEngagements);
server.get('/DVP/API/:version/Engagement/:id', authorization({resource:"engagement", action:"read"}), engagementService.GetEngagement);
server.get('/DVP/API/:version/EngagementByProfile/:id', authorization({resource:"engagement", action:"read"}), engagementService.GetEngagementByProfile);
server.del('/DVP/API/:version/Engagement/:id', authorization({resource:"engagement", action:"delete"}), engagementService.DeleteEngagement);
server.post('/DVP/API/:version/Engagement', authorization({resource:"engagement", action:"write"}), engagementService.CreateEngagement);
server.post('/DVP/API/:version/Engagement/:id/EngagementSession', authorization({resource:"engagement", action:"write"}), engagementService.AddEngagementSession);
server.del('/DVP/API/:version/Engagement/:id/EngagementSession/:session', authorization({resource:"engagement", action:"delete"}), engagementService.DeleteEngagementSession);
server.post('/DVP/API/:version/EngagementSession/:session/Note', authorization({resource:"engagement", action:"write"}), engagementService.AppendNoteToEngagementSession);






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
server.listen(port, function () {

    logger.info("DVP-LiteTicket.main Server %s listening at %s", server.name, server.url);

});



