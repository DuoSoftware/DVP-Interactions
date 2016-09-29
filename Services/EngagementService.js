/**
 * Created by a on 7/10/2016.
 */


var mongoose = require('mongoose');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var Engagement = require('dvp-mongomodels/model/Engagement').Engagement;
var EngagementSession = require('dvp-mongomodels/model/Engagement').EngagementSession;
var EngagementNote = require('dvp-mongomodels/model/Engagement').EngagementNote;
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var ExternalUser = require('dvp-mongomodels/model/ExternalUser');



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


}
function GetEngagements(req,res){


    logger.debug("DVP-Interactions.GetEngagements Internal method ");
    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    Engagement.find({company: company, tenant: tenant, _id: { $in: req.params.ids }}, function(err, engagement) {
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


}
function GetEngagementsWithData(req,res){

    logger.debug("DVP-Interactions.GetEngagement Internal method ");
    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    Engagement.find({company: company, tenant: tenant}).populate('EngagementSession').exec(function(err, engagements) {
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
function GetEngagementWithData(req,res){


    logger.debug("DVP-Interactions.GetEngagement Internal method ");
    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;
    Engagement.findOne({company: company, tenant: tenant, _id:req.params.id}).populate('engagements').exec(function(err, engagement) {
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


    ExternalUser.findOne({company: company, tenant: tenant, _id: req.body.profile}, function(err, users) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get External Users Failed", false, undefined);
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
                        res.end(jsonString);
                    } else {

                        jsonString = messageFormatter.FormatMessage(undefined, "Engagement saved successfully", true, engage);
                        res.end(jsonString);
                    }
                });


            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No External Users Found", false, undefined);
                res.end(jsonString);

            }
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

        _id: req.body.engagement_id,
        engagement_id: req.body.engagement_id,
        channel: req.body.channel,
        channel_from: req.body.channel_from,
        channel_to: req.body.channel_to,
        direction: req.body.direction,
        company: company,
        has_profile: true,
        tenant: tenant,
        created_at: Date.now(),
        updated_at: Date.now()

    });

    engagementSession.save(function (err, engage) {
        if (err) {
            jsonString = messageFormatter.FormatMessage(err, "Engagement Session save failed", false, undefined);
            res.end(jsonString);
        } else {

            Engagement.findOneAndUpdate({
                company: company,
                tenant: tenant,
                profile: req.params.id
            }, {
                $addToSet: {
                    engagements: engagementSession._id
                },
                $setOnInsert: {

                    profile: req.params.id,
                    created_at: Date.now(),
                    company: company,
                    tenant: tenant
                },
                $set:{

                    updated_at: Date.now(),
                }

            },{upsert:true, new: true}, function (err, session) {
                if (err) {
                    jsonString = messageFormatter.FormatMessage(err, "Add Engagement Session Failed", false, undefined);

                } else {
                    //engage.profile_id = users[0].id;
                    jsonString = messageFormatter.FormatMessage(undefined, "Add Engagement Session Successful", true, engage);
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

        }
    });
};
function DeleteEngagementSession(req, res){


    logger.debug("DVP-Interactions.DeleteEngagementSession Internal method ");

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;



    EngagementSession.findOneAndRemove({engagement_id: req.params.session,company: company, tenant: tenant}, function(err, engagement) {
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
function GetEngagementSessions(req, res){


    logger.debug("DVP-Interactions.GetEngagementSessions Internal method ");

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;


    var paramArr;
    if(Array.isArray(req.query.session)) {
        paramArr = req.query.session;
    }else{

        paramArr = [req.query.session];
    }


    EngagementSession.find({engagement_id: { $in: paramArr },company: company, tenant: tenant}, function(err, engagement) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get EngagementSessions Failed", false, undefined);

        }else {

            if (engagement) {


                jsonString = messageFormatter.FormatMessage(err, "Get EngagementSession Successful", true, engagement);

            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No EngagementSession Found", false, undefined);

            }
        }

        res.end(jsonString);
    });

};
function getEngagementSessionNote(req, res){


    logger.debug("DVP-LiteTicket.getEngagementSessionNote Internal method ");

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    EngagementSession.findOne({engagement_id: req.params.session,company: company, tenant: tenant},'notes', function (err, eng) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "getEngagementSessionNote Failed", false, undefined);

        } else {

            jsonString = messageFormatter.FormatMessage(undefined, "getEngagementSessionNote Successful", true, eng);

        }

        res.end(jsonString);
    });



};
function AppendNoteToEngagementSession(req, res){


    logger.debug("DVP-LiteTicket.AppendNoteToEngagementSession Internal method ");

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

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

            jsonString = messageFormatter.FormatMessage(undefined, "Append Note To EngagementSession Successful", true, notes);

        }

        res.end(jsonString);
    });



};
function RemoveNoteFromEngagementSession(req, res){


    logger.debug("DVP-LiteTicket.RemoveNoteFromEngagementSession Internal method ");

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    req.body.updated_at = Date.now();
    EngagementSession.findOneAndUpdate({engagement_id: req.params.session,company: company, tenant: tenant}, { pull :{
        notes : {
            _id: req.body.noteid
        }}}, function (err, notes) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Remove Note From EngagementSession Failed", false, undefined);

        } else {

            jsonString = messageFormatter.FormatMessage(undefined, "Remove Note From EngagementSession Successful", true, notes);

        }

        res.end(jsonString);
    });



};
function UpdateNoteInEngagementSession(req, res){


    logger.debug("DVP-LiteTicket.UpdateNoteInEngagementSession Internal method ");

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    req.body.updated_at = Date.now();
    EngagementSession.findOneAndUpdate({engagement_id: req.params.session,company: company, tenant: tenant, 'notes.id':req.body.noteid}, { $set :{
        notes : {
            'notes.$.body': req.body.body
        }}}, function (err, notes) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Update Note In EngagementSession Failed", false, undefined);

        } else {

            jsonString = messageFormatter.FormatMessage(undefined, "Update Note In EngagementSession Successful", true, notes);

        }

        res.end(jsonString);
    });



};
function AddEngagementSessionForProfile(req, res) {

    logger.debug("DVP-Interactions.AddEngagementSessionForProfile Internal method ");

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var category = req.body.channel;

    var contact = req.body.channel_from;
    if(req.body.direction == 'outbound')
        contact= req.body.channel_to;


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

    if(category == 'call' || category == 'sms' ){

        var otherQuery = {company: company, tenant: tenant, "contacts.type": "phone", "contacts.contact": contact};
        orArray.push(otherQuery);

        var queryObject = {company: company, tenant: tenant};
        queryObject["phone"] = contact;

        orArray.push(queryObject);

        queryObject = {company: company, tenant: tenant};
        queryObject["landnumber"] = contact;

        orArray.push(queryObject);
    } else if(category == 'facebook-post' || category == 'facebook-chat'){


        var otherQuery = {company: company, tenant: tenant, "contacts.type": "facebook", "contacts.contact": contact};
        orArray.push(otherQuery);

        var queryObject = {company: company, tenant: tenant};
        queryObject["facebook"] = contact;

        orArray.push(queryObject);
    }else{

        var otherQuery = {company: company, tenant: tenant, "contacts.type": category, "contacts.contact": contact};
        orArray.push(otherQuery);

        var queryObject = {company: company, tenant: tenant};
        queryObject[category] = contact;

        orArray.push(queryObject);
    }


    var orQuery = {$or: orArray};


    ExternalUser.find(orQuery, function (err, users) {

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
                company: company,
                tenant: tenant,
                has_profile: true,
                created_at: Date.now(),
                updated_at: Date.now()

            });


                   engagementSession.save(function (err, engage) {
                        if (err) {
                            jsonString = messageFormatter.FormatMessage(err, "Engagement Session save failed", false, undefined);
                            res.end(jsonString);
                        } else {

                                Engagement.findOneAndUpdate({
                                    company: company,
                                    tenant: tenant,
                                    profile: users[0].id
                                }, {
                                    $addToSet: {
                                        engagements: engagementSession._id
                                    },
                                    $setOnInsert: {
                                        //updated_at: Date.now(),
                                        profile: users[0].id,
                                        created_at: Date.now(),
                                        company: company,
                                        tenant: tenant
                                    },
                                    $set:{


                                        updated_at: Date.now()
                                    }

                                },{upsert:true, new: true}, function (err, session) {
                                    if (err) {

                                        jsonString = messageFormatter.FormatMessage(err, "Add Engagement Session Failed", false, undefined);

                                    } else {

                                        engage.profile_id = users[0].id;

                                        jsonString = messageFormatter.FormatMessage(undefined, "Add Engagement Session Successful", true, engage);

                                    }

                                    res.end(jsonString);

                                });

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

            engagementSession.save(function (err, engage) {
                if (err) {
                    jsonString = messageFormatter.FormatMessage(err, "Engagement Session save failed", false, undefined);

                } else {

                    jsonString = messageFormatter.FormatMessage(undefined, "Engagement Session saved successfully", true, engage);
                }

                res.end(jsonString);
            });
        }
    });
}
function MoveEngagementBetweenProfiles(req, res){


    logger.debug("DVP-LiteTicket.MoveEngagementBetweenProfiles Internal method ");

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    req.body.updated_at = Date.now();
    EngagementSession.findOne({engagement_id: req.params.session,company: company, tenant: tenant}, function (err, session) {
        if (err || (req.params.from == req.params.to)) {

            jsonString = messageFormatter.FormatMessage(err, "Find engagement Failed", false, undefined);
            res.end(jsonString);

        } else {

            ////////engagement session found///////////////////////////////////////////////////////////////////////////////
            if(session){


                Engagement.findOneAndUpdate({company: company, tenant: tenant, profile: req.params.to}, {
                    $addToSet: {
                        engagements: session._id
                    }
                }, function (err, engagement) {
                    if (err) {

                        jsonString = messageFormatter.FormatMessage(err, "Add Engagement Session Failed", false, undefined);
                        res.end(jsonString);

                    } else {

                        if (req.params.operation == 'cut' && engagement) {
                            Engagement.findOneAndUpdate({
                                profile: req.params.from,
                                company: company,
                                tenant: tenant
                            }, {$pull: {'engagements': session._id}}, function (err, engagement) {
                                if (err) {

                                    jsonString = messageFormatter.FormatMessage(err, "Remove Engagement Failed", false, undefined);


                                } else {

                                    jsonString = messageFormatter.FormatMessage(undefined, "Remove Engagement successfully", false, engagement);

                                }

                                res.end(jsonString);


                            });

                        }else{

                            if(engagement) {
                                jsonString = messageFormatter.FormatMessage(undefined, "Operation stopped because copy item failed", false, undefined);
                            }else{

                                jsonString = messageFormatter.FormatMessage(undefined, "Operation completed successfully", true, undefined);


                            }
                            res.end(jsonString);

                        }
                    }

                });

            }else{

                jsonString = messageFormatter.FormatMessage(err, "Engagement Session Not Found", false, undefined);
                res.end(jsonString);

            }
        }

    });
};
function GetIsolatedEngagementSessions(req, res) {

    logger.debug("DVP-LiteTicket.GetEngagementSessionsWhichHasNoProfile Internal method ");

    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;


    EngagementSession.find({
        has_profile: false,
        company: company,
        tenant: tenant
    }, function (err, session) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Find Engagement Session Failed", false, undefined);


        } else {

            jsonString = messageFormatter.FormatMessage(err, "Find Engagement Session Successful ", false, session);

        }

        res.end(jsonString);
    })
}
function AddIsolatedEngagementSession(req, res) {

    logger.debug("DVP-Interactions.GetEngagement Internal method ");
    var company = parseInt(req.user.company);
    var tenant = parseInt(req.user.tenant);
    var jsonString;

    EngagementSession.findOneAndUpdate({engagement_id: req.params.session, company: company, tenant: tenant, has_profile: false}, {
        has_profile: true
    },function (err, engagementSession) {
        if (err) {
            jsonString = messageFormatter.FormatMessage(err, "Engagement Session save failed", false, undefined);
            res.end(jsonString);
        } else {


            if (engagementSession) {

                Engagement.findOneAndUpdate({company: company, tenant: tenant, profile: req.params.profile}, {
                    $addToSet: {
                        engagements: engagementSession._id
                    },
                    $set: {

                        profile: req.params.profile,
                        updated_at: Date.now()
                    },
                    $setOnInsert: {
                        updated_at: Date.now(),
                        created_at: Date.now(),
                        company: company,
                        tenant: tenant
                    }

                }, {upsert: true}, function (err, session) {
                    if (err) {

                        jsonString = messageFormatter.FormatMessage(err, "Add Engagement Session Failed", false, undefined);

                    } else {

                        jsonString = messageFormatter.FormatMessage(undefined, "Add Engagement Session Successful", true, session);

                    }

                    res.end(jsonString);
                });
            } else {

                jsonString = messageFormatter.FormatMessage(undefined, "Engagement Session save failed", false, undefined);
                res.end(jsonString);
            }

        }
    });
};



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
module.exports.GetEngagementSessionNote = getEngagementSessionNote;
module.exports.AppendNoteToEngagementSession = AppendNoteToEngagementSession;
module.exports.RemoveNoteFromEngagementSession = RemoveNoteFromEngagementSession;
module.exports.UpdateNoteInEngagementSession = UpdateNoteInEngagementSession;
module.exports.AddEngagementSessionForProfile = AddEngagementSessionForProfile;
module.exports.MoveEngagementBetweenProfiles = MoveEngagementBetweenProfiles;
module.exports.GetIsolatedEngagenetSessions = GetIsolatedEngagementSessions;
module.exports.AddIsolatedEngagementSession = AddIsolatedEngagementSession;

