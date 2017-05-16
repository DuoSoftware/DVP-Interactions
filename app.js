var restify = require('restify');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var config = require('config');
var jwt = require('restify-jwt');
var mongoose = require('mongoose');
var secret = require('dvp-common/Authentication/Secret.js');
var authorization = require('dvp-common/Authentication/Authorization.js');
var inboxService = require('./Services/UserInboxService.js');
var engagementService = require('./Services/EngagementService');



var util = require('util');
var port = config.Host.port || 3000;
var host = config.Host.vdomain || 'localhost';




var server = restify.createServer({
    name: "DVP Engagement Service"
});

server.pre(restify.pre.userAgentConnection());
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: false }));

restify.CORS.ALLOW_HEADERS.push('authorization');
restify.CORS.ALLOW_HEADERS.push('companyinfo');
server.use(restify.CORS());
server.use(restify.fullResponse());

server.use(jwt({secret: secret.Secret}));


//var mongoip=config.Mongo.ip;
//var mongoport=config.Mongo.port;
//var mongodb=config.Mongo.dbname;
//var mongouser=config.Mongo.user;
//var mongopass = config.Mongo.password;
//
//
//
//var mongoose = require('mongoose');
//var connectionstring = util.format('mongodb://%s:%s@%s:%d/%s',mongouser,mongopass,mongoip,mongoport,mongodb)
//
//
//mongoose.connection.on('error', function (err) {
//    //throw new Error(err);
//    logger.error(err)
//});
//
//mongoose.connection.on('disconnected', function() {
//    //throw new Error('Could not connect to database');
//    logger.error('Could not connect to database')
//
//});
//
//mongoose.connection.once('open', function() {
//    console.log("Connected to db");
//});
//
//
//mongoose.connect(connectionstring);


var util = require('util');
var mongoip=config.Mongo.ip;
var mongoport=config.Mongo.port;
var mongodb=config.Mongo.dbname;
var mongouser=config.Mongo.user;
var mongopass = config.Mongo.password;
var mongoreplicaset= config.Mongo.replicaset;

var mongoose = require('mongoose');
var connectionstring = '';
mongoip = mongoip.split(',');
if(util.isArray(mongoip)){
 if(mongoip.length > 1){    
    mongoip.forEach(function(item){
        connectionstring += util.format('%s:%d,',item,mongoport)
    });

    connectionstring = connectionstring.substring(0, connectionstring.length - 1);
    connectionstring = util.format('mongodb://%s:%s@%s/%s',mongouser,mongopass,connectionstring,mongodb);

    if(mongoreplicaset){
        connectionstring = util.format('%s?replicaSet=%s',connectionstring,mongoreplicaset) ;
    }
 }
    else
    {
        connectionstring = util.format('mongodb://%s:%s@%s:%d/%s',mongouser,mongopass,mongoip[0],mongoport,mongodb);
    }
}else{

    connectionstring = util.format('mongodb://%s:%s@%s:%d/%s',mongouser,mongopass,mongoip,mongoport,mongodb);
}

var async = require("async");


mongoose.connect(connectionstring,{server:{auto_reconnect:true}});


mongoose.connection.on('error', function (err) {
    console.error( new Error(err));
    mongoose.disconnect();

});

mongoose.connection.on('opening', function() {
    console.log("reconnecting... %d", mongoose.connection.readyState);
});


mongoose.connection.on('disconnected', function() {
    console.error( new Error('Could not connect to database'));
    mongoose.connect(connectionstring,{server:{auto_reconnect:true}});
});

mongoose.connection.once('open', function() {
    console.log("Connected to db");

});


mongoose.connection.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});



process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

///////////////////////////////Engagement////////////////////////////////////////////////////////////////////////////////////////////

server.get('/DVP/API/:version/Engagements', authorization({resource:"engagement", action:"read"}), engagementService.GetEngagements);
server.get('/DVP/API/:version/Engagement/:id', authorization({resource:"engagement", action:"read"}), engagementService.GetEngagement);
server.get('/DVP/API/:version/Engagements/:ids', authorization({resource:"engagement", action:"read"}), engagementService.GetEngagements);
server.get('/DVP/API/:version/EngagementsWithData', authorization({resource:"engagement", action:"read"}), engagementService.GetEngagementsWithData);
server.get('/DVP/API/:version/EngagementWithData/:id', authorization({resource:"engagement", action:"read"}), engagementService.GetEngagementWithData);
server.get('/DVP/API/:version/IsolatedEngagementSessions', authorization({resource:"engagement", action:"read"}), engagementService.GetIsolatedEngagenetSessions);
server.get('/DVP/API/:version/EngagementByProfile/:id', authorization({resource:"engagement", action:"read"}), engagementService.GetEngagementByProfile);
server.del('/DVP/API/:version/Engagement/:id', authorization({resource:"engagement", action:"delete"}), engagementService.DeleteEngagement);
server.post('/DVP/API/:version/Engagement', authorization({resource:"engagement", action:"write"}), engagementService.CreateEngagement);
server.post('/DVP/API/:version/Engagement/:id/EngagementSession', authorization({resource:"engagement", action:"write"}), engagementService.AddEngagementSession);
server.put('/DVP/API/:version/Engagement/:profile/IsolatedEngagementSession/:session', authorization({resource:"engagement", action:"write"}), engagementService.AddIsolatedEngagementSession);
server.get('/DVP/API/:version/Engagement/:id/EngagementSessions', authorization({resource:"engagement", action:"read"}), engagementService.GetEngagementSessions);
server.del('/DVP/API/:version/Engagement/:id/EngagementSession/:session', authorization({resource:"engagement", action:"delete"}), engagementService.DeleteEngagementSession);
server.post('/DVP/API/:version/EngagementSession/:session/Note', authorization({resource:"engagement", action:"write"}), engagementService.AppendNoteToEngagementSession);
server.get('/DVP/API/:version/EngagementSession/:session/Note', authorization({resource:"engagement", action:"read"}), engagementService.GetEngagementSessionNote);
server.del('/DVP/API/:version/EngagementSession/:session/Note/:noteid', authorization({resource:"engagement", action:"delete"}), engagementService.RemoveNoteFromEngagementSession);
server.put('/DVP/API/:version/EngagementSession/:session/Note/:noteid', authorization({resource:"engagement", action:"write"}), engagementService.UpdateNoteInEngagementSession);
server.put('/DVP/API/:version/EngagementSession/:session/Move/:operation/From/:from/To/:to', authorization({resource:"engagement", action:"write"}), engagementService.MoveEngagementBetweenProfiles);
server.post('/DVP/API/:version/EngagementSessionForProfile', authorization({resource:"engagement", action:"write"}), engagementService.AddEngagementSessionForProfile);
server.get('/DVP/API/:version/EngagementSessionCount/:id', authorization({resource:"engagement", action:"read"}), engagementService.GetEngagementCounts);



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////User Inbox///////////////////////////////////////////////////////////////////////////////////////////////////

server.post('/DVP/API/:version/Inbox/Message', authorization({resource:"inbox", action:"write"}), inboxService.AddMessageToInbox);
server.put('/DVP/API/:version/Inbox/:profileId/Message/:messageId/Read', authorization({resource:"inbox", action:"write"}), inboxService.SetMessageAsRead);
server.post('/DVP/API/:version/Inbox/:profileId/RemoveMessages', authorization({resource:"inbox", action:"delete"}), inboxService.DeleteMessages);
server.get('/DVP/API/:version/Inbox/:profileId/Messages/Unread', authorization({resource:"inbox", action:"read"}), inboxService.GetUnreadMessages);
server.get('/DVP/API/:version/Inbox/:profileId/Messages/Read', authorization({resource:"inbox", action:"read"}), inboxService.GetReadMessages);
server.get('/DVP/API/:version/Inbox/:profileId/Messages/All', authorization({resource:"inbox", action:"read"}), inboxService.GetInboxMessages);
server.get('/DVP/API/:version/Inbox/:profileId/Counts', authorization({resource:"inbox", action:"read"}), inboxService.GetMessageInboxCounts);
server.get('/DVP/API/:version/Inbox/:profileId/Messages/Deleted', authorization({resource:"inbox", action:"read"}), inboxService.GetDeletedMessages);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


server.listen(port, function () {

    logger.info("DVP-LiteTicket.main Server %s listening at %s", server.name, server.url);

});





