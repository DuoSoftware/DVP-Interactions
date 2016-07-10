/**
 * Created by a on 7/10/2016.
 */


var mongoose = require('mongoose');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var Engagement = require('dvp-mongomodels/model/Engagement').Engagement;
var EngagementSession = require('dvp-mongomodels/model/Engagement').EngagementSession;
var EngagementNote = require('dvp-mongomodels/model/Engagement').EngagementNote;
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;



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
    Engagement.findOne({company: company, tenant: tenant, _id: req.params.id}, function(err, engagement) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get Engagements Failed", false, undefined);

        }else {

            if (engagement) {


                jsonString = messageFormatter.FormatMessage(err, "Get Engagements Successful", true, engagement);

            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No Engagements Found", false, undefined);

            }
        }

        res.end(jsonString);
    });


};
function GetEngagementByProfile(req,res){


    logger.debug("DVP-Interactions.GetEngagement Internal method ");
    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    Engagement.findOne({company: company, tenant: tenant, profile: req.params.id}, function(err, engagement) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get Engagements Failed", false, undefined);

        }else {

            if (engagement) {


                jsonString = messageFormatter.FormatMessage(err, "Get Engagements Successful", true, engagement);

            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No Engagements Found", false, undefined);

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


    var engagement = Engagement({

        profile: req.body.profile,
        company: company,
        tenant: tenant,
        created_at: Date.now(),
        updated_at: Date.now()

    });

    engagement.save(function (err, engage) {
        if (err) {
            jsonString = messageFormatter.FormatMessage(err, "Engagement save failed", false, undefined);
            res.end(jsonString);
        } else {


            jsonString = messageFormatter.FormatMessage(undefined, "Engagement saved successfully", true, engage);
            res.end(jsonString);
        }
    });
};
function DeleteEngagement(req,res){


    logger.debug("DVP-Interactions.DeleteEngagement Internal method ");

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    Engagement.findOneAndRemove({_id: req.params.id,company: company, tenant: tenant}, function(err, engagement) {
        if (err) {
            jsonString = messageFormatter.FormatMessage(err, "Delete Engagement failed", false, undefined);
        }else{
            jsonString = messageFormatter.FormatMessage(undefined, "Delete Engagement Success", true, undefined);
        }
        res.end(jsonString);
    });

};
function AddEngagementSession(req, res) {

   logger.debug("DVP-Interactions.GetEngagement Internal method ");
    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;


    var engagementSession = EngagementSession({

        engagement_id: req.body.engagement_id,
        channel: req.body.channel,
        channel_from: req.body.channel_from,
        channel_to: req.body.channel_to,
        created_at: Date.now(),
        updated_at: Date.now()

    });

    engagementSession.save(function (err, engage) {
        if (err) {
            jsonString = messageFormatter.FormatMessage(err, "Engagement Session save failed", false, undefined);
            res.end(jsonString);
        } else {



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

        }
    });
};
function DeleteEngagementSession(req, res){


    logger.debug("DVP-Interactions.DeleteEngagementSession Internal method ");

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;



    EngagementSession.findOneAndRemove({_id: req.params.session}, function(err, engagement) {
        if (err) {
            jsonString = messageFormatter.FormatMessage(err, "Delete Engagement failed", false, undefined);
            res.end(jsonString);
        }else{


            Engagement.findOneAndUpdate({_id: req.params.id,company: company, tenant: tenant},{ $pull: { 'engagements':  req.params.session}}, function(err, engagement) {
                if (err) {

                    jsonString = messageFormatter.FormatMessage(err, "Remove Engagement Failed", false, undefined);


                }else{

                    jsonString = messageFormatter.FormatMessage(undefined, "Remove Engagement successfully", false, engagement);

                }

                res.end(jsonString);


            });
        }

    });



};
function AppendNoteToEngagementSession(req, res){


    logger.debug("DVP-LiteTicket.AppendNoteToEngagementSession Internal method ");

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    req.body.updated_at = Date.now();
    EngagementSession.findOneAndUpdate({_id: req.params.session}, { $addToSet :{
        notes : {
            body: req.body.body,
            author: req.user.iss,
            created_at: Date.now(),
        }}}, function (err, notes) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Append Note To EngagementSession Failed", false, undefined);

        } else {

            jsonString = messageFormatter.FormatMessage(undefined, "Append Note To EngagementSession Successful", true, notes);

        }

        res.end(jsonString);
    });



};


module.exports.GetEngagements = GetEngagements;
module.exports.GetEngagement = GetEngagement;
module.exports.GetEngagementByProfile = GetEngagementByProfile;
module.exports.CreateEngagement = CreateEngagement;
module.exports.DeleteEngagement = DeleteEngagement;
module.exports.AddEngagementSession = AddEngagementSession;
module.exports.DeleteEngagementSession = DeleteEngagementSession;
module.exports.AppendNoteToEngagementSession = AppendNoteToEngagementSession;

