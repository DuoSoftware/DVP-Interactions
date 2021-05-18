/**
 * Created by a on 7/10/2016.
 */


//var mongoose = require('mongoose');
var logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
var Engagement = require('dvp-mongomodels/model/Engagement').Engagement;
var EngagementSession = require('dvp-mongomodels/model/Engagement').EngagementSession;
var EngagementNote = require('dvp-mongomodels/model/Engagement').EngagementNote;
var messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var ExternalUser = require('dvp-mongomodels/model/ExternalUser');
var amqp = require('amqp');
var config = require('config');
var util = require('util');




///////////////////////////////////////////////////////////////////////////////////////////

var ips = [];
if(config.RabbitMQ.ip) {
    ips = config.RabbitMQ.ip.split(",");
}


var queueConnection = amqp.createConnection({
    //url: queueHost,
    host: ips,
    port: config.RabbitMQ.port,
    login: config.RabbitMQ.user,
    password: config.RabbitMQ.password,
    vhost: config.RabbitMQ.vhost,
    noDelay: true,
    heartbeat:10
}, {
    reconnect: true,
    reconnectBackoffStrategy: 'linear',
    reconnectExponentialLimit: 120000,
    reconnectBackoffTime: 1000
});

////////////////////////////rabbitmq//////////////////////////////////////////////////////
// var queueHost = util.format('amqp://%s:%s@%s:%d', config.RabbitMQ.user, config.RabbitMQ.password, config.RabbitMQ.ip, config.RabbitMQ.port);
// var queueConnection = amqp.createConnection({
//     url: queueHost
// });

/////////////////////////////////////////////////////////////////////////////////////
queueConnection.on('ready', function () {

    logger.info("Confection with the queue is OK");

});


queueConnection.on('error', function (error) {

    logger.error("Issue in ards", error);

});
/////////////////////////////////////////////////////////////////////////////////////////////////////



//var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;



function GetEngagements(req,res){

    logger.debug("DVP-Interactions.GetEngagement Internal method ");
    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    Engagement.find({company: company, tenant: tenant}, function(err, engagements) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get Engagements Failed", false, undefined);

        }else {

            if (engagements) {


                jsonString = messageFormatter.FormatMessage(err, "Get Engagements Successful", true, engagements);

            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No Engagements Found", false, undefined);

            }
        }

        res.end(jsonString);
    });


};
function GetEngagement(req,res){


    logger.debug("DVP-Interactions.GetEngagement Internal method ");
    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    logger.info('[EngagementService.GetEngagement] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);
    Engagement.findOne({company: company, tenant: tenant, _id: req.params.id}, function(err, engagement) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get Engagements Failed", false, undefined);
            logger.error('[EngagementService.GetEngagement] - [MongoDB]  - Error occurred - [%s]', err);

        }else {

            if (engagement) {

                jsonString = messageFormatter.FormatMessage(err, "Get Engagements Successful", true, engagement);
                logger.info('[EngagementService.GetEngagement] - [%s] - [%s] - [MongoDB]  - Data found for Engagement - [%s]',  tenant, company, JSON.stringify(engagement));


            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No Engagements Found", false, undefined);
                logger.error('[EngagementService.GetEngagement] - [MongoDB]  - No record found for Engagement - [%s] - [%s]  ', tenant, company);

            }
        }

        res.end(jsonString);
    });


}
function GetEngagements(req,res){


    logger.debug("DVP-Interactions.GetEngagements Internal method ");
    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    logger.info('[EngagementService.GetEngagements] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);
    Engagement.find({company: company, tenant: tenant, _id: { $in: req.params.ids }}, function(err, engagement) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get Engagements Failed", false, undefined);
            logger.error('[EngagementService.GetEngagements] - [MongoDB]  - Error occurred - [%s]', err);

        }else {

            if (engagement) {


                jsonString = messageFormatter.FormatMessage(err, "Get Engagements Successful", true, engagement);
                logger.info('[EngagementService.GetEngagements] - [%s] - [%s] - [MongoDB]  - Data found for Engagements - [%s]',  tenant, company, JSON.stringify(engagement));


            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No Engagements Found", false, undefined);
                logger.error('[EngagementService.GetEngagements] - [MongoDB]  - No record found for Engagements - [%s] - [%s]  ', tenant, company);

            }
        }

        res.end(jsonString);
    });


}
function GetEngagementsWithData(req,res){

    logger.debug("DVP-Interactions.GetEngagement Internal method ");
    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    logger.info('[EngagementService.GetEngagementsWithData] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);

    Engagement.find({company: company, tenant: tenant}).populate('EngagementSession').exec(function(err, engagements) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get Engagements Failed", false, undefined);
            logger.error('[EngagementService.GetEngagementsWithData] - [MongoDB]  - Error occurred - [%s]', err);

        }else {

            if (engagements) {


                jsonString = messageFormatter.FormatMessage(err, "Get Engagements Successful", true, engagements);
                logger.info('[EngagementService.GetEngagementsWithData] - [%s] - [%s] - [MongoDB]  - Data found for Engagement - [%s]',  tenant, company, JSON.stringify(engagements));


            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No Engagements Found", false, undefined);
                logger.error('[EngagementService.GetEngagementsWithData] - [MongoDB]  - No record found for Engagement - [%s] - [%s]  ', tenant, company);


            }
        }

        res.end(jsonString);
    });


};
function GetEngagementWithData(req,res){


   
    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    logger.info('[EngagementService.GetEngagementWithData] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);

    Engagement.findOne({company: company, tenant: tenant, _id:req.params.id}).populate('engagements').exec(function(err, engagement) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get Engagements Failed", false, undefined);
            logger.error('[EngagementService.GetEngagementWithData] - [MongoDB]  - Error occurred - [%s]', err);

        }else {

            if (engagement) {


                jsonString = messageFormatter.FormatMessage(err, "Get Engagements Successful", true, engagement);
                logger.info('[EngagementService.GetEngagementWithData] - [%s] - [%s] - [MongoDB]  - Data found for Engagement - [%s]',  tenant, company, JSON.stringify(engagement));


            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No Engagements Found", false, undefined);
                logger.error('[EngagementService.GetEngagementWithData] - [MongoDB]  - No record found for Engagement - [%s] - [%s]  ', tenant, company);


            }
        }

        res.end(jsonString);
    });


};
function GetEngagementByProfile(req,res){


    
    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    logger.info('[EngagementService.GetEngagementByProfile] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);

    Engagement.findOne({company: company, tenant: tenant, profile: req.params.id}, function(err, engagement) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get Engagements Failed", false, undefined);
            logger.error('[EngagementService.GetEngagementByProfile] - [MongoDB]  - Error occurred - [%s]', err);

        }else {

            if (engagement) {


                jsonString = messageFormatter.FormatMessage(err, "Get Engagements Successful", true, engagement);
                logger.info('[EngagementService.GetEngagementByProfile] - [%s] - [%s] - [MongoDB]  - Data found for Engagement - [%s]',  tenant, company, JSON.stringify(engagement));


            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No Engagements Found", false, undefined);
                logger.error('[EngagementService.GetEngagementByProfile] - [MongoDB]  - No record found for Engagement- [%s] - [%s]  ', tenant, company);


            }
        }

        res.end(jsonString);
    });

};
function CreateEngagement(req,res) {


    logger.debug("DVP-Interactions.CreateEngagement Internal method ");
    var jsonString;
    var tenant = parseInt(req.user.tenant);
    var company = parseInt(req.user.company);

    logger.info('[EngagementService.CreateEngagement] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);



    ExternalUser.findOne({company: company, tenant: tenant, _id: req.body.profile}, function(err, users) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get External Users Failed", false, undefined);
            logger.error('[EngagementService.CreateEngagement] - [MongoDB]  - Error occurred - [%s]', err);

            res.end(jsonString);

        }else {

            if (users) {

                var engagement = Engagement({

                    profile: req.body.profile,
                    company: company,
                    tenant: tenant,
                    body: req.body.body,
                    created_at: Date.now(),
                    updated_at: Date.now()

                });

                engagement.save(function (err, engage) {
                    if (err) {
                        jsonString = messageFormatter.FormatMessage(err, "Engagement save failed", false, undefined);
                        logger.error('[EngagementService.CreateEngagement] - [MongoDB]  - Error occurred - [%s]', err);
                        res.end(jsonString);
                    } else {

                        jsonString = messageFormatter.FormatMessage(undefined, "Engagement saved successfully", true, engage);
                        logger.info('[EngagementService.CreateEngagement] - [%s] - [%s] - [MongoDB]  - Engagement saved - [%s]',  tenant, company, JSON.stringify(engage));
                        res.end(jsonString);
                    }
                });


            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No External Users Found", false, undefined);
                logger.error('[EngagementService.CreateEngagement] - [MongoDB]  - No record found for External Users- [%s] - [%s]  ', tenant, company);
                res.end(jsonString);

            }
        }
    });
};
function DeleteEngagement(req,res){

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    logger.info('[EngagementService.DeleteEngagement] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);
    Engagement.findOneAndRemove({_id: req.params.id,company: company, tenant: tenant}, function(err, engagement) {
        if (err) {
            jsonString = messageFormatter.FormatMessage(err, "Delete Engagement failed", false, undefined);
            logger.error('[EngagementService.DeleteEngagement] - [MongoDB]  - Error occurred - [%s]', err);

        }else{
            jsonString = messageFormatter.FormatMessage(undefined, "Delete Engagement Success", true, undefined);
            logger.info('[EngagementService.DeleteEngagement] - [%s] - [%s] - [MongoDB]  - Engagement Deleted  - [%s]',  tenant, company, JSON.stringify(engagement));

        }
        res.end(jsonString);
    });

};
function AddEngagementSession(req, res) {

  
    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    logger.info('[EngagementService.AddEngagementSession] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    var engagementSession = EngagementSession({

        _id: req.body.engagement_id,
        engagement_id: req.body.engagement_id,
        channel: req.body.channel,
        channel_from: req.body.channel_from,
        channel_to: req.body.channel_to,
        direction: req.body.direction,
        company: company,
        has_profile: true,
        profile_id: req.params.id,
        tenant: tenant,
        created_at: Date.now(),
        updated_at: Date.now()

    });

    engagementSession.save(function (err, engage) {
        if (err) {
            jsonString = messageFormatter.FormatMessage(err, "Engagement Session save failed", false, undefined);
            logger.error('[EngagementService.AddEngagementSession] - [MongoDB]  - Error occurred - [%s]', err);
            res.end(jsonString);
        } else {

            if(req.body.channel != 'api') {
                Engagement.findOneAndUpdate({
                    company: company,
                    tenant: tenant,
                    profile: req.params.id
                }, {

                    $push: {
                        engagements: {
                            $each: [engagementSession._id],
                            $position: 0
                        }
                    },
                    $setOnInsert: {

                        profile: req.params.id,
                        created_at: Date.now(),
                        company: company,
                        tenant: tenant
                    },
                    $set: {

                        updated_at: Date.now(),
                    }

                }, {upsert: true, new: true}, function (err, session) {
                    if (err) {
                        jsonString = messageFormatter.FormatMessage(err, "Add Engagement Session Failed", false, undefined);
                        logger.error('[EngagementService.AddEngagementSession] - [MongoDB]  - Error occurred - [%s]', err);

                    } else {
                        //engage.profile_id = users[0].id;
                        jsonString = messageFormatter.FormatMessage(undefined, "Add Engagement Session Successful", true, engage);
                        logger.info('[EngagementService.AddEngagementSession] - [%s] - [%s] - [MongoDB]  - Data Saved for engagementSession - [%s]',  tenant, company, JSON.stringify(engage));

                    }

                    res.end(jsonString);

                });
                /*
                 Engagement.findOneAndUpdate({company: company, tenant: tenant, _id: req.params.id}, {
                 $addToSet: {
                 engagements: engagementSession._id
                 }
                 }, function (err, session) {
                 if (err) {

                 jsonString = messageFormatter.FormatMessage(err, "Add Engagement Session Failed", false, undefined);

                 } else {

                 jsonString = messageFormatter.FormatMessage(undefined, "Add Engagement Session Successful", true, session);

                 }

                 res.end(jsonString);
                 });
                 */
            }else {


                jsonString = messageFormatter.FormatMessage(undefined, "Add Engagement Session Successful", true, engage);
                logger.info('[EngagementService.AddEngagementSession] - [%s] - [%s] - [MongoDB]  - Data Saved for engagementSession - [%s]',  tenant, company, JSON.stringify(engage));


                res.end(jsonString);
            }

        }
    });
};
function DeleteEngagementSession(req, res){



    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    logger.info('[EngagementService.DeleteEngagementSession] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    EngagementSession.findOneAndRemove({engagement_id: req.params.session,company: company, tenant: tenant}, function(err, engagement) {
        if (err) {
            jsonString = messageFormatter.FormatMessage(err, "Delete Engagement failed", false, undefined);
            res.end(jsonString);
        }else{


            Engagement.findOneAndUpdate({_id: req.params.id,company: company, tenant: tenant},{ $pull: { 'engagements':  req.params.session}}, function(err, engagement) {
                if (err) {

                    jsonString = messageFormatter.FormatMessage(err, "Remove Engagement Failed", false, undefined);
                    logger.error('[EngagementService.DeleteEngagementSession] - [MongoDB]  - Error occurred - [%s]', err);


                }else{

                    jsonString = messageFormatter.FormatMessage(undefined, "Remove Engagement successfully", false, engagement);
                    logger.info('[EngagementService.DeleteEngagementSession] - [%s] - [%s] - [MongoDB]  - EngagmentSession Deleted ',  tenant, company);


                }

                res.end(jsonString);


            });
        }

    });



};
function GetEngagementSessions_back(req, res){



    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    logger.info('[EngagementService.GetEngagementSessions_back] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);

    var paramArr;
    if(Array.isArray(req.query.session)) {
        paramArr = req.query.session;
    }else{

        paramArr = [req.query.session];
    }


    EngagementSession.find({engagement_id: { $in: paramArr },company: company, tenant: tenant}, function(err, engagement) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get EngagementSessions Failed", false, undefined);
            logger.error('[EngagementService.GetEngagementSessions_back] - [MongoDB]  - Error occurred - [%s]', err);


        }else {

            if (engagement) {

                engagement.sort(function(a, b) {
                    // Sort docs by the order of their _id values in ids.
                    return paramArr.indexOf(a.engagement_id) - paramArr.indexOf(b.engagement_id);
                });



                jsonString = messageFormatter.FormatMessage(err, "Get EngagementSession Successful", true, engagement);
                logger.info('[EngagementService.GetEngagementSessions_back] - [%s] - [%s] - [MongoDB]  - Data found for EngagementSession - [%s]',  tenant, company, JSON.stringify(engagement));


            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No EngagementSession Found", false, undefined);
                logger.error('[EngagementService.GetEngagementSessions_back] - [MongoDB]  - No record found for EngagementSession- [%s] - [%s]  ', tenant, company);


            }
        }

        res.end(jsonString);
    });

};
function GetUserEngagementSessions(req, res) {


    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    logger.info('[EngagementService.GetUserEngagementSessions] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    var userProfile = req.params.id;
    var limitCount = parseInt(req.query.limit);
    var skipCount = parseInt(req.query.skip);
    var sort = 'descending';

    var query = {
        profile_id: userProfile,
        company: company,
        tenant: tenant
    }

    if (req.query.channel) {
        if (Array.isArray(req.query.channel)) {
            query.channel = {$in: req.query.channel.map(function(item){return item.toLowerCase()})}
        } else {
            query.channel = req.query.channel;
        }
    }else{
        query.channel = {$ne: 'api'}
    }

    if (req.query.direction) {
        query.direction = req.query.direction;
    }

    if (req.query.from) {
        query.channel_from = req.query.from;
    }

    if (req.query.to) {
        query.channel_to = req.query.to;
    }

    if (req.query.startdate && req.query.enddate) {
        query.created_at = {
            $gte: new Date(req.query.startdate),
            $lte: new Date(req.query.enddate)
        };
    }

    if (req.query.sort) {
        sort = req.query.sort;
    }

    EngagementSession.find(query)
        .sort({created_at: sort})
        .skip(skipCount)
        .limit(limitCount)
        .exec(function (err, engagements) {
            if (err) {

                jsonString = messageFormatter.FormatMessage(err, "Get EngagementSessions Failed", false, undefined);
                logger.error('[EngagementService.GetUserEngagementSessions] - [MongoDB]  - Error occurred - [%s]', err);


            } else {

                if (engagements) {

                    jsonString = messageFormatter.FormatMessage(err, "Get EngagementSessions Successful", true, engagements);
                    logger.info('[EngagementService.GetUserEngagementSessions] - [%s] - [%s] - [MongoDB]  - Data found for EngagementSesssion- [%s]',  tenant, company, JSON.stringify(engagements));


                } else {

                    jsonString = messageFormatter.FormatMessage(undefined, "No EngagementSessions Found", false, undefined);
                    logger.error('[EngagementService.GetUserEngagementSessions] - [MongoDB]  - No record found for EngagementSession- [%s] - [%s]  ', tenant, company);


                }
            }

            res.end(jsonString);
        });

};
function GetUserEngagementSessionsCount(req, res){


    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    var userProfile = req.params.id;
    logger.info('[EngagementService.GetUserEngagementSessionsCount] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    var query = {
        profile_id: userProfile,
        company: company,
        tenant: tenant
    }

    if(req.query.channel){
        if(Array.isArray(req.query.channel)){
            query.channel = {$in:req.query.channel}
        }else{
            query.channel =  req.query.channel;
        }
    }

    if(req.query.direction){
        query.direction =  req.query.direction;
    }

    if(req.query.from){
        query.channel_from =  req.query.from;
    }

    if(req.query.to){
        query.channel_to =  req.query.to;
    }

    if(req.query.startdate && req.query.enddate){
        query.created_at =  {
            $gte: new Date(req.query.startdate),
            $lte:  new Date(req.query.enddate)
        };
    }


    EngagementSession.find(query).count( function(err, engagement) {
            if (err) {

                jsonString = messageFormatter.FormatMessage(err, "Get EngagementSessions Failed", false, undefined);
                logger.error('[EngagementService.GetUserEngagementSessionsCount] - [MongoDB]  - Error occurred - [%s]', err);


            }else {

                if (engagement) {

                    jsonString = messageFormatter.FormatMessage(err, "Get EngagementSessions Successful", true, engagement);
                    logger.info('[EngagementService.GetUserEngagementSessionsCount] - [%s] - [%s] - [MongoDB]  - Data found for EngagementSession- [%s]',  tenant, company, JSON.stringify(engagement));


                }else{

                    jsonString = messageFormatter.FormatMessage(undefined, "No EngagementSessions Found", false, undefined);
                    logger.error('[EngagementService.GetUserEngagementSessionsCount] - [MongoDB]  - No record found for EngagementSession - [%s] - [%s]  ', tenant, company);


                }
            }

            res.end(jsonString);
        });

};
function getEngagementSessionNote(req, res){



    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    logger.info('[EngagementService.getEngagementSessionNote] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    EngagementSession.findOne({engagement_id: req.params.session,company: company, tenant: tenant},'notes', function (err, eng) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "getEngagementSessionNote Failed", false, undefined);
            logger.error('[EngagementService.getEngagementSessionNote] - [MongoDB]  - Error occurred - [%s]', err);


        } else {

            if (eng) {

                jsonString = messageFormatter.FormatMessage(undefined, "getEngagementSessionNote Successful", true, eng);
                logger.info('[EngagementService.getEngagementSessionNote] - [%s] - [%s] - [MongoDB]  - Data found for EngagementSession - [%s]',  tenant, company, JSON.stringify(eng));

            }else{

            jsonString = messageFormatter.FormatMessage(undefined, "getEngagementSessionNote Successful", true, eng);
                jsonString = messageFormatter.FormatMessage(undefined, "No EngagementSessions Found", false, undefined);
                logger.error('[EngagementService.getEngagementSessionNote] - [MongoDB]  - No record found for EngagementSession - [%s] - [%s]  ', tenant, company);

            }

        }

        res.end(jsonString);
    });



};
function AppendNoteToEngagementSession(req, res){


    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    logger.info('[EngagementService.AppendNoteToEngagementSession] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);

    req.body.updated_at = Date.now();
    EngagementSession.findOneAndUpdate({engagement_id: req.params.session,company: company, tenant: tenant}, { $addToSet :{
        notes : {
            body: req.body.body,
            author: req.user.iss,
            created_at: Date.now(),
        }}}, function (err, notes) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Append Note To EngagementSession Failed", false, undefined);

        } else {

            Engagement.findOneAndUpdate({profile: req.params.profile,company: company, tenant: tenant}, { $push :{
                engagements : req.params.session
            }}, function (err, engagement) {
            if (err) {
                if(!engagement){
                    var engagement = Engagement({

                        profile: req.params.profile,
                        company: company,
                        tenant: tenant,
                        engagements : [req.params.session],
                        created_at: Date.now(),
                        updated_at: Date.now()

                    });

                    engagement.save(function (err, engage) {
                        if (err) {
                            jsonString = messageFormatter.FormatMessage(err, "Engagement save failed", false, undefined);
                            logger.error('[EngagementService.AppendNoteToEngagementSession] - [MongoDB]  - Error occurred - [%s]', err);

                            res.end(jsonString);
                        } else {

                            jsonString = messageFormatter.FormatMessage(undefined, "Engagement saved successfully", true, notes);
                            logger.info('[EngagementService.AppendNoteToEngagementSession] - [%s] - [%s] - [MongoDB]  - Append Note To EngagementSession - [%s]',  tenant, company, JSON.stringify(notes));

                            res.end(jsonString);
                        }
                    });
                }

                jsonString = messageFormatter.FormatMessage(err, "Append EngagementSession To Engagement Failed", false, undefined);

            } else {
                jsonString = messageFormatter.FormatMessage(undefined, "Append EngagementSession To Engagement Successful", true, notes);
            }
            res.end(jsonString);
        });

            jsonString = messageFormatter.FormatMessage(undefined, "Append Note To EngagementSession Successful", true, notes);

        }

        res.end(jsonString);
    });



};
function RemoveNoteFromEngagementSession(req, res){


    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    logger.info('[EngagementService.RemoveNoteFromEngagementSession] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    req.body.updated_at = Date.now();
    EngagementSession.findOneAndUpdate({engagement_id: req.params.session,company: company, tenant: tenant}, { pull :{
        notes : {
            _id: req.body.noteid
        }}}, function (err, notes) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Remove Note From EngagementSession Failed", false, undefined);
            logger.error('[EngagementService.RemoveNoteFromEngagementSession] - [MongoDB]  - Error occurred - [%s]', err);


        } else {

            jsonString = messageFormatter.FormatMessage(undefined, "Remove Note From EngagementSession Successful", true, notes);
            logger.info('[EngagementService.RemoveNoteFromEngagementSession] - [%s] - [%s] - [MongoDB]  - Removed Note from EngagementSession - [%s]',  tenant, company, JSON.stringify(notes));


        }

        res.end(jsonString);
    });



};
function UpdateNoteInEngagementSession(req, res){


    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    logger.info('[EngagementService.UpdateNoteInEngagementSession] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    req.body.updated_at = Date.now();
    EngagementSession.findOneAndUpdate({engagement_id: req.params.session,company: company, tenant: tenant, 'notes.id':req.body.noteid}, { $set :{
        notes : {
            'notes.$.body': req.body.body
        }}}, function (err, notes) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Update Note In EngagementSession Failed", false, undefined);
            logger.error('[EngagementService.UpdateNoteInEngagementSession] - [MongoDB]  - Error occurred - [%s]', err);


        } else {

            jsonString = messageFormatter.FormatMessage(undefined, "Update Note In EngagementSession Successful", true, notes);
            logger.info('[EngagementService.UpdateNoteInEngagementSession] - [%s] - [%s] - [MongoDB]  - Update Note in EngagementSession - [%s]',  tenant, company, JSON.stringify(notes));


        }

        res.end(jsonString);
    });



};
function AddEngagementSessionForProfile(req, res) {


    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var category = req.body.channel;
    logger.info('[EngagementService.AddEngagementSessionForProfile] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    var contact = req.body.channel_from;
    //if(req.body.channel_id)
    //    contact = req.body.channel_id;

    if(req.body.direction == 'outbound')
        contact= req.body.channel_to;

    var contactInfo = {
        contact_name: req.body.channel_id,
        type: category,
        display: req.body.channel_from,
        verified: true,
        raw: req.body.raw
    };

    logger.info(contactInfo);


    var jsonString;

/*

    var otherQuery = {company: company, tenant: tenant, "contacts.type": category, "contacts.contact": contact};
    var orArray = [otherQuery];

    if(category == 'call' || category == 'sms' ){

        var queryObject = {company: company, tenant: tenant};
        queryObject["phone"] = contact;

        orArray.push(queryObject);

        queryObject = {company: company, tenant: tenant};
        queryObject["landnumber"] = contact;

        orArray.push(queryObject);
    } else if(category == 'facebook-post' || category == 'facebook-chat'){

        var queryObject = {company: company, tenant: tenant};
        queryObject["facebook"] = contact;

        orArray.push(queryObject);
    }else{

        var queryObject = {company: company, tenant: tenant};
        queryObject[category] = contact;

        orArray.push(queryObject);
    }


    var orQuery = {$or: orArray};
*/

 var orArray = [];

    var otherQuery;
    var queryObject;

    if(category == 'call' || category == 'sms' ){

        otherQuery = {company: company, tenant: tenant, "contacts.type": "phone", "contacts.contact": contact};


        queryObject = {company: company, tenant: tenant};
        queryObject["landnumber"] = contact;

        orArray.push(queryObject);


        queryObject = {company: company, tenant: tenant};
        queryObject["phone"] = contact;

        orArray.push(queryObject);



    } else if(category == 'facebook-post' || category == 'facebook-chat'){

        otherQuery = {company: company, tenant: tenant, "contacts.type": "facebook", "contacts.contact": contact};

        queryObject = {company: company, tenant: tenant};
        queryObject["facebook"] = contact;

        orArray.push(queryObject);

    }else if(category == 'chat'){

        otherQuery = {company: company, tenant: tenant, "contacts.type": "email", "contacts.contact": contact};


        queryObject = {company: company, tenant: tenant};
        queryObject["email"] = contact;

        orArray.push(queryObject);

    }else if(category == 'skype'){

        otherQuery = {company: company, tenant: tenant, "contacts.type": "skype", "contacts.contact": contact};


        queryObject = {company: company, tenant: tenant};
        queryObject["skype"] = contact;

        orArray.push(queryObject);

    }else{

        otherQuery = {company: company, tenant: tenant, "contacts.type": category, "contacts.contact": contact};


        queryObject = {company: company, tenant: tenant};
        queryObject[category] = contact;

        orArray.push(queryObject);
    }


    var orQuery = {$or: orArray};

    if(config.Host.profilesearch == "primary"){

        orQuery = queryObject;

    }else if(config.Host.profilesearch == "secondary"){

        orArray.push(otherQuery);
        orQuery = {$or: orArray};

    }else if(config.Host.profilesearch == "secondaryonly"){

        orQuery = otherQuery;

    }else{

        orArray.push(otherQuery);
        orQuery = {$or: orArray};
        logger.info("Selected default method, which may take longer .........");
    }


    logger.info(orQuery);


    ExternalUser.find(orQuery).limit(5).exec(function (err, users) {

        ////////////////////////////////////External users found/////////////////////////////////////////////
        if (!err && users && users.length == 1) {

            ////////////////////////exact one user///////////////////////////////////////////////



            var engagementSession = EngagementSession({

                _id: req.body.engagement_id,
                engagement_id: req.body.engagement_id,
                channel: req.body.channel,
                channel_from: req.body.channel_from,
                channel_to: req.body.channel_to,
                direction: req.body.direction,
                body: req.body.body,
                contact: contactInfo,
                company: company,
                tenant: tenant,
                has_profile: true,
                profile_id: users[0].id,
                created_at: Date.now(),
                updated_at: Date.now()

            });


            if(contactInfo)
                engagementSession.contact = contactInfo;

            if (req.body.user)
                engagementSession.user_info = req.body.user;


            engagementSession.save(function (err, engage) {
                if (err) {
                    jsonString = messageFormatter.FormatMessage(err, "Engagement Session save failed", false, undefined);
                    logger.error('[EngagementService.AddEngagementSessionForProfile] - [MongoDB]  - Error occurred - [%s]', err);

                    res.end(jsonString);
                } else {

                    if(req.body.channel != 'api') {


                        Engagement.findOneAndUpdate({
                            company: company,
                            tenant: tenant,
                            profile: users[0].id
                        }, {


                            $push: {
                                engagements: {
                                    $each: [engagementSession._id],
                                    $position: 0
                                }
                            },


                            $setOnInsert: {
                                //updated_at: Date.now(),
                                profile: users[0].id,
                                created_at: Date.now(),
                                company: company,
                                tenant: tenant
                            },
                            $set: {


                                updated_at: Date.now()
                            }

                        }, {upsert: true, new: true}, function (err, session) {
                            if (err) {

                                jsonString = messageFormatter.FormatMessage(err, "Add Engagement Session Failed", false, undefined);
                                logger.error('[EngagementService.AddEngagementSessionForProfile] - [MongoDB]  - Error occurred - [%s]', err);


                            } else {

                                engage.profile_id = users[0].id;

                                jsonString = messageFormatter.FormatMessage(undefined, "Add Engagement Session Successful", true, engage);
                                logger.info('[EngagementService.AddEngagementSessionForProfile] - [%s] - [%s] - [MongoDB]  - Add EngagementSession - [%s]',  tenant, company, JSON.stringify(engage));


                            }

                            res.end(jsonString);

                        });
                    }else {


                        jsonString = messageFormatter.FormatMessage(undefined, "Add Engagement Session Successful", true, engage);
                        logger.info('[EngagementService.AddEngagementSessionForProfile] - [%s] - [%s] - [MongoDB]  - Add EngagementSession - [%s]',  tenant, company, JSON.stringify(engage));


                        res.end(jsonString);
                    }

                }
            });

        } else {

            var engagementSession = EngagementSession({

                _id: req.body.engagement_id,
                engagement_id: req.body.engagement_id,
                channel: req.body.channel,
                channel_from: req.body.channel_from,
                channel_to: req.body.channel_to,
                company: company,
                direction: req.body.direction,
                body: req.body.body,
                has_profile: false,
                tenant: tenant,
                created_at: Date.now(),
                updated_at: Date.now()

            });

            if(req.body.user)
                engagementSession.user_info = req.body.user;

            if(contactInfo)
                engagementSession.contact = contactInfo;


            engagementSession.save(function (err, engage) {
                if (err) {
                    jsonString = messageFormatter.FormatMessage(err, "Engagement Session save failed", false, undefined);
                    logger.error('[EngagementService.AddEngagementSessionForProfile] - [MongoDB]  - Error occurred - [%s]', err);


                } else {

                    jsonString = messageFormatter.FormatMessage(undefined, "Engagement Session saved successfully", true, engage);
                    logger.info('[EngagementService.AddEngagementSessionForProfile] - [%s] - [%s] - [MongoDB]  - EngagementSession Saved - [%s]',  tenant, company, JSON.stringify(engage));

                }

                res.end(jsonString);
            });
        }
    });
}
function MoveEngagementBetweenProfiles(req, res){


    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    logger.info('[EngagementService.MoveEngagementBetweenProfiles] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);



    EngagementSession.findOne({engagement_id: req.params.session,company: company, tenant: tenant}, function (err, session) {
        if (err || (req.params.from == req.params.to)) {

            jsonString = messageFormatter.FormatMessage(err, "Find engagement Failed", false, undefined);
            logger.error('[EngagementService.MoveEngagementBetweenProfiles] - [MongoDB]  - Error occurred - [%s]', err);

            res.end(jsonString);

        } else {

            ////////engagement session found///////////////////////////////////////////////////////////////////////////////
            if(session){


                Engagement.findOneAndUpdate({company: company, tenant: tenant, profile: req.params.to}, {
                    $push: {
                        engagements: {
                            $each: [session._id],
                            $position: 0
                        }
                    },


                    $setOnInsert: {

                        profile: req.params.to,
                        created_at: Date.now(),
                        company: company,
                        tenant: tenant
                    },
                    $set: {

                        updated_at: Date.now(),
                    }

                },{upsert:true, new: true}, function (err, engagement) {
                    if (err) {

                        jsonString = messageFormatter.FormatMessage(err, "Add Engagement Session Failed", false, undefined);
                        logger.error('[EngagementService.MoveEngagementBetweenProfiles] - [MongoDB]  - Error occurred - [%s]', err);

                        res.end(jsonString);

                    } else {

                        if (req.params.operation == 'cut' && engagement) {
                            Engagement.findOneAndUpdate({
                                profile: req.params.from,
                                company: company,
                                tenant: tenant
                            }, {
                                $pull: {'engagements': session._id}}, function (err, engagement) {
                                if (err) {

                                    jsonString = messageFormatter.FormatMessage(err, "Remove Engagement Failed", false, undefined);
                                    logger.error('[EngagementService.MoveEngagementBetweenProfiles] - [MongoDB]  - Error occurred - [%s]', err);



                                } else {

                                    jsonString = messageFormatter.FormatMessage(undefined, "Remove Engagement successfully", true, engagement);
                                    logger.info('[EngagementService.MoveEngagementBetweenProfiles] - [%s] - [%s] - [MongoDB]  - Remove Engagement - [%s]',  tenant, company, JSON.stringify(engagement));


                                }

                                res.end(jsonString);


                            });

                        }else{

                            if(engagement) {
                                jsonString = messageFormatter.FormatMessage(undefined, "Operation stopped because copy item failed", false, undefined);
                            }else{

                                jsonString = messageFormatter.FormatMessage(undefined, "Operation completed successfully", true, undefined);
                                logger.info('[EngagementService.MoveEngagementBetweenProfiles] - [%s] - [%s] - [MongoDB]  - Engagement Moved',  tenant, company);



                            }
                            res.end(jsonString);

                        }
                    }

                });

            }else{

                jsonString = messageFormatter.FormatMessage(err, "Engagement Session Not Found", false, undefined);
                logger.error('[EngagementService.GetEngagements] - [MongoDB]  - No record found for Engagement Session- [%s] - [%s]  ', tenant, company);

                res.end(jsonString);

            }
        }

    });
};
function GetIsolatedEngagementSessions(req, res) {


    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    logger.info('[EngagementService.GetIsolatedEngagementSessions] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    EngagementSession.find({
        has_profile: false,
        company: company,
        tenant: tenant
    }, function (err, session) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Find Engagement Session Failed", false, undefined);
            logger.error('[EngagementService.GetIsolatedEngagementSessions] - [MongoDB]  - Error occurred - [%s]', err);



        } else {

            jsonString = messageFormatter.FormatMessage(err, "Find Engagement Session Successful ", false, session);
            logger.info('[EngagementService.GetIsolatedEngagementSessions] - [%s] - [%s] - [MongoDB]  - Data found for EngagementSession - [%s]',  tenant, company, JSON.stringify(session));


        }

        res.end(jsonString);
    })
}
function AddIsolatedEngagementSession(req, res) {

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    logger.info('[EngagementService.AddIsolatedEngagementSession] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    EngagementSession.findOneAndUpdate({engagement_id: req.params.session, company: company, tenant: tenant, has_profile: false}, {
        has_profile: true,
        profile_id: req.params.profile
    },function (err, engagementSession) {
        if (err) {
            jsonString = messageFormatter.FormatMessage(err, "Engagement Session save failed", false, undefined);
            logger.error('[EngagementService.AddIsolatedEngagementSession] - [MongoDB]  - Error occurred - [%s]', err);

            res.end(jsonString);
        } else {
            if (engagementSession) {


                if(engagementSession.channel != 'api') {


                    Engagement.findOneAndUpdate({company: company, tenant: tenant, profile: req.params.profile}, {
                        $push: {
                            engagements: {
                                $each: [engagementSession._id],
                                $position: 0
                            }
                        },
                        $set: {

                            profile: req.params.profile,
                            updated_at: Date.now()
                        },
                        $setOnInsert: {
                            //updated_at: Date.now(),
                            created_at: Date.now(),
                            company: company,
                            tenant: tenant
                        }

                    }, {upsert: true}, function (err, session) {
                        if (err) {

                            jsonString = messageFormatter.FormatMessage(err, "Add Engagement Session Failed", false, undefined);
                            logger.error('[EngagementService.AddIsolatedEngagementSession] - [MongoDB]  - Error occurred - [%s]', err);


                        } else {

                            jsonString = messageFormatter.FormatMessage(undefined, "Add Engagement Session Successful", true, session);
                            logger.info('[EngagementService.AddIsolatedEngagementSession] - [%s] - [%s] - [MongoDB]  - Engagement Saved - [%s]',  tenant, company, JSON.stringify(session));


                        }

                        res.end(jsonString);
                    });
                }else{
                    jsonString = messageFormatter.FormatMessage(undefined, "Add Engagement Session Successful", true, undefined);
                    logger.info('[EngagementService.AddIsolatedEngagementSession] - [%s] - [%s] - [MongoDB]  - Data found for EngagementSession - [%s]',  tenant, company, JSON.stringify(engagementSession));

                    res.end(jsonString);


                }
            } else {

                jsonString = messageFormatter.FormatMessage(undefined, "Engagement Session save failed", false, undefined);
                logger.error('[EngagementService.GetEngagements] - [MongoDB]  - No record found for Engagement Session - [%s] - [%s]  ', tenant, company);

                res.end(jsonString);
            }

        }
    });
};
function GetEngagementCounts(req,res){


    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    logger.info('[EngagementService.GetEngagementCounts] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);

    Engagement.findOne({company: company, tenant: tenant, profile: req.params.id}, function(err, engagement) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get Engagements Failed", false, undefined);
            logger.error('[EngagementService.GetEngagementCounts] - [MongoDB]  - Error occurred - [%s]', err);


        }else {

            if (engagement) {


                jsonString = messageFormatter.FormatMessage(err, "Get Engagements Successful", true, engagement);

                logger.info('[EngagementService.GetEngagementCounts] - [%s] - [%s] - [MongoDB]  - Data found for Engagements - [%s]',  tenant, company, JSON.stringify(engagement));



                var aggregator = [

                    {
                        $match: {engagement_id: {$in: engagement.engagements}},

                    },

                    {
                        "$group": {_id: "$channel", count: {$sum: 1}}
                    }
                ];

                EngagementSession.aggregate(aggregator, function (err, tickets) {
                    if (err) {
                        jsonString = messageFormatter.FormatMessage(err, "Get Engagements count Failed", false, undefined);
                        logger.error('[EngagementService.GetEngagementCounts] - [MongoDB]  - Error occurred - [%s]', err);

                    } else {


                        jsonString = messageFormatter.FormatMessage(undefined, "Get Engagements count Successful", true, tickets);
                        logger.info('[EngagementService.GetEngagementCounts] - [%s] - [%s] - [MongoDB]  - Data found for Engagements count - [%s]',  tenant, company, JSON.stringify(tickets));


                    }
                    res.end(jsonString);
                });


            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No Engagements Found", false, undefined);
                logger.error('[EngagementService.GetEngagementCounts] - [MongoDB]  - No record found for Engagements- [%s] - [%s]  ', tenant, company);

                res.end(jsonString);

            }
        }


    });


}
function Interact(req, res) {


    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    var queueName;
    logger.info('[EngagementService.Interact] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    try {
        var message = {
            from: req.body.from,
            to: req.body.to,
            body: req.body.body,
            update_comment: true,
            company: company,
            tenant: tenant,
            Parameters: req.body.parameters,
            template: req.body.template,
            attachments: req.body.attachments,
            author: req.user.iss
        };

        if (req.body.channel == 'twitter') {
            queueName = 'TWEETOUT';
        } else if (req.body.channel == 'sms') {
            queueName = 'SMSOUT';
        } else if (req.body.channel == 'email') {
            queueName = 'EMAILOUT';
        } else if (req.body.channel == 'facebook-post') {
            queueName = 'FACEBOOKOUT';
            if (req.body.contact && req.body.contact && req.body.contact.raw && req.body.contact.raw.id) {

                message.from = req.body.contact.raw.id;
            }

        } else if (req.body.channel == 'facebook-chat') {
            queueName = 'FACEBOOKOUT';
            if (req.body.contact && req.body.contact && req.body.contact.raw && req.body.contact.raw.id) {

                message.from = req.body.contact.raw.id;
            }

        } else {
            jsonString = messageFormatter.FormatMessage(undefined, "Given channel does not  support engagement", false, undefined);
            res.end(jsonString);
            return;
        }


        queueConnection.publish(queueName, message, {
            contentType: 'application/json'
        });

        jsonString = messageFormatter.FormatMessage(undefined, "Message published to the queue", true, message);
        res.end(jsonString);

    } catch (exp) {

        //console.log(exp);
        jsonString = messageFormatter.FormatMessage(exp, "Message published to the queue", true, undefined);
        res.end(jsonString);
    }

};
function GetEngagementSessions(req, res) {



    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    logger.info('[EngagementService.GetEngagementSessions] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    var limitCount = parseInt(req.query.limit);
    var skipCount = parseInt(req.query.skip);
    var sort = 'descending';

    var query = {
        company: company,
        tenant: tenant
    }

    if (req.query.channel) {
        if (Array.isArray(req.query.channel)) {
            query.channel = {$in: req.query.channel.map(function(item){return item.toLowerCase()})}
        } else {
            query.channel = req.query.channel;
        }
    }else{
        query.channel = {$ne: 'api'}
    }

    if (req.query.direction) {
        query.direction = req.query.direction;
    }

    if (req.query.from) {
        query.channel_from = req.query.from;
    }

    if (req.query.to) {
        query.channel_to = req.query.to;
    }

    if (req.query.startDate && req.query.endDate) {
        query.created_at = {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate)
        };
    }

    if (req.query.sort) {
        sort = req.query.sort;
    }

    EngagementSession.find(query)
        .sort({created_at: sort})
        .skip(skipCount)
        .limit(limitCount)
        .exec(function (err, engagements) {
            if (err) {

                jsonString = messageFormatter.FormatMessage(err, "Get EngagementSessions Failed", false, undefined);
                logger.error('[EngagementService.GetEngagementSessions] - [MongoDB]  - Error occurred - [%s]', err);


            } else {

                if (engagements) {

                    jsonString = messageFormatter.FormatMessage(err, "Get EngagementSessions Successful", true, engagements);
                    logger.info('[EngagementService.GetEngagementSessions] - [%s] - [%s] - [MongoDB]  - Data found for Engagements - [%s]',  tenant, company, JSON.stringify(engagements));


                } else {

                    jsonString = messageFormatter.FormatMessage(undefined, "No EngagementSessions Found", false, undefined);
                    logger.error('[EngagementService.GetEngagementSessions] - [MongoDB]  - No record found for Engagements - [%s] - [%s]  ', tenant, company);


                }
            }

            res.end(jsonString);
        });

};
function GetEngagementSessionsCount(req, res){


    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    logger.info('[EngagementService.GetEngagementSessionsCount] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    var query = {
        company: company,
        tenant: tenant
    }

    if(req.query.channel){
        if(Array.isArray(req.query.channel)){
            query.channel = {$in:req.query.channel}
        }else{
            query.channel =  req.query.channel;
        }
    }

    if(req.query.direction){
        query.direction =  req.query.direction;
    }

    if(req.query.from){
        query.channel_from =  req.query.from;
    }

    if(req.query.to){
        query.channel_to =  req.query.to;
    }

    if(req.query.startDate && req.query.endDate){
        query.created_at =  {
            $gte: new Date(req.query.startDate),
            $lte:  new Date(req.query.endDate)
        };
    }


    EngagementSession.find(query).count( function(err, engagement) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get EngagementSessions Failed", false, undefined);
            logger.error('[EngagementService.GetEngagementSessionsCount] - [MongoDB]  - Error occurred - [%s]', err);


        }else {

            if (engagement) {

                jsonString = messageFormatter.FormatMessage(err, "Get EngagementSessions Successful", true, engagement);
                logger.info('[EngagementService.GetEngagementSessionsCount] - [%s] - [%s] - [MongoDB]  - Data found for EngagementSession - [%s]',  tenant, company, JSON.stringify(engagement));


            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No EngagementSessions Found", false, undefined);
                logger.error('[EngagementService.GetEngagementSessions] - [MongoDB]  - No record found for EngagementSession - [%s] - [%s]  ', tenant, company);


            }
        }

        res.end(jsonString);
    });

};
function GetEngagementSession(req, res){


    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    logger.info('[EngagementService.GetEngagementSession] - [HTTP]  - Request received - [%s] - [%s]',  tenant, company);


    var session = req.params.session;


    EngagementSession.findOne({engagement_id:  session,company: company, tenant: tenant}, function(err, engagement) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get EngagementSessions Failed", false, undefined);
            logger.error('[EngagementService.GetEngagementSession] - [MongoDB]  - Error occurred - [%s]', err);


        }else {

            if (engagement) {

                jsonString = messageFormatter.FormatMessage(err, "Get EngagementSession Successful", true, engagement);
                logger.info('[EngagementService.GetEngagementSession] - [%s] - [%s] - [MongoDB]  - Data found for Engagement - [%s]',  tenant, company, JSON.stringify(engagement));


            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No EngagementSession Found", false, undefined);
                logger.error('[EngagementService.GetEngagementSession] - [MongoDB]  - No record found for Engagement- [%s] - [%s]  ', tenant, company);


            }
        }

        res.end(jsonString);
    });

};



module.exports.Interact = Interact;
module.exports.GetEngagements = GetEngagements;
module.exports.GetEngagement = GetEngagement;
module.exports.GetEngagementsWithData = GetEngagementsWithData;
module.exports.GetEngagementWithData = GetEngagementWithData;
module.exports.GetEngagementByProfile = GetEngagementByProfile;
module.exports.CreateEngagement = CreateEngagement;
module.exports.DeleteEngagement = DeleteEngagement;
module.exports.AddEngagementSession = AddEngagementSession;
module.exports.DeleteEngagementSession = DeleteEngagementSession;
module.exports.GetEngagementSessions = GetEngagementSessions;
module.exports.GetEngagementSession = GetEngagementSession;
module.exports.GetEngagementSessionNote = getEngagementSessionNote;
module.exports.AppendNoteToEngagementSession = AppendNoteToEngagementSession;
module.exports.RemoveNoteFromEngagementSession = RemoveNoteFromEngagementSession;
module.exports.UpdateNoteInEngagementSession = UpdateNoteInEngagementSession;
module.exports.AddEngagementSessionForProfile = AddEngagementSessionForProfile;
module.exports.MoveEngagementBetweenProfiles = MoveEngagementBetweenProfiles;
module.exports.GetIsolatedEngagenetSessions = GetIsolatedEngagementSessions;
module.exports.AddIsolatedEngagementSession = AddIsolatedEngagementSession;
module.exports.GetEngagementCounts= GetEngagementCounts;
module.exports.GetUserEngagementSessions = GetUserEngagementSessions;
module.exports.GetUserEngagementSessionsCount = GetUserEngagementSessionsCount;
module.exports.GetEngagementSessions = GetEngagementSessions;
module.exports.GetEngagementSessionsCount = GetEngagementSessionsCount;
module.exports.GetEngagementSessions_back = GetEngagementSessions_back;
