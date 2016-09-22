/**
 * Created by dinusha on 7/15/2016.
 */

var mongoose = require('mongoose');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var InboxMessage = require('dvp-mongomodels/model/UserInbox').InboxMessage;
var User = require('dvp-mongomodels/model/User');
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

function AddMessageToInbox(req, res, next)
{
    var reqId = uuid.v1();
    try
    {
        logger.debug('[DVP-Interactions.AddMessageToInbox] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var profileId = req.body.profile;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        User.findOne({company: companyId, tenant: tenantId, _id: profileId}, function(err, user)
        {
            if(user)
            {

                var inboxMsg = InboxMessage({

                    engagement_session: req.body.engagementSession,
                    profile: profileId,
                    message: req.body.message,
                    has_read: false,
                    has_replied: false,
                    message_type: req.body.msgType,
                    message_state: 'RECEIVED',
                    received_at: Date.now(),
                    company: companyId,
                    tenant: tenantId

                });

                inboxMsg.save(function (err, inboxMsgRes)
                {
                    if (err)
                    {
                        var jsonString = messageFormatter.FormatMessage(err, "Error saving message", false, false);
                        logger.error('[DVP-Interactions.AddMessageToInbox] - [%s] - API RESPONSE : %s', reqId, jsonString);
                        res.end(jsonString);
                    }
                    else
                    {
                        var jsonString = messageFormatter.FormatMessage(null, "Message saved successfully", true, true);
                        logger.debug('[DVP-Interactions.AddMessageToInbox] - [%s] - API RESPONSE : %s', reqId, jsonString);
                        res.end(jsonString);
                    }
                });


            }

        });

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, false);
        logger.error('[DVP-Interactions.AddMessageToInbox] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

};

function SetMessageAsRead(req, res, next)
{
    var reqId = uuid.v1();
    try
    {
        logger.debug('[DVP-Interactions.SetMessageAsRead] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var profileId = req.body.profile;
        var msgId = req.body.messageId;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        InboxMessage.findOneAndUpdate(
            {company: companyId, tenant: tenantId, _id: msgId, profile: profileId},
            {
                has_read: true

            }, function (err, inboxObj)
            {
                if(err)
                {
                    var jsonString = messageFormatter.FormatMessage(err, "Error setting read state", false, false);
                    logger.error('[DVP-Interactions.SetMessageAsRead] - [%s] - API RESPONSE : %s', reqId, jsonString);
                    res.end(jsonString);
                }
                else
                {
                    var jsonString = messageFormatter.FormatMessage(null, "State changed successfully", true, true);
                    logger.debug('[DVP-Interactions.SetMessageAsRead] - [%s] - API RESPONSE : %s', reqId, jsonString);
                    res.end(jsonString);
                }

            });

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, undefined);
        logger.error('[DVP-Interactions.SetMessageAsRead] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

};

function DeleteMessage(req, res, next)
{
    var reqId = uuid.v1();
    try
    {
        logger.debug('[DVP-Interactions.DeleteMessage] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var profileId = req.params.profileId;
        var msgId = req.params.messageId;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        InboxMessage.findOneAndUpdate(
            {company: companyId, tenant: tenantId, _id: msgId, profile: profileId},
            {
                message_state: 'DELETED'

            }, function (err, inboxObj)
            {
                if(err)
                {
                    var jsonString = messageFormatter.FormatMessage(err, "Error deleting message", false, false);
                    logger.error('[DVP-Interactions.DeleteMessage] - [%s] - API RESPONSE : %s', reqId, jsonString);
                    res.end(jsonString);
                }
                else
                {
                    var jsonString = messageFormatter.FormatMessage(null, "Message deleted successfully", true, true);
                    logger.debug('[DVP-Interactions.DeleteMessage] - [%s] - API RESPONSE : %s', reqId, jsonString);
                    res.end(jsonString);
                }

            });

    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, undefined);
        logger.error('[DVP-Interactions.DeleteMessage] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

};

//Bind Function
var SendGetMessagesResponse = function(res, reqId, err, msgs)
{
    if(err)
    {
        var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, undefined);
        logger.error('[DVP-Interactions.SendGetMessagesResponse] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }
    else
    {
        var jsonString = messageFormatter.FormatMessage(null, "SUCCESS", true, msgs);
        logger.debug('[DVP-Interactions.SendGetMessagesResponse] - [%s] - API RESPONSE : %s', reqId, 'MESSAGES FOUND - NOT PRINTING DUE TO PERFORMANCE');
        res.end(jsonString);
    }
}

function GetUnreadMessages(req, res, next)
{
    var reqId = uuid.v1();
    var emptyArr = [];
    try
    {
        logger.debug('[DVP-Interactions.GetUnReadMessages] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var profileId = req.params.profileId;
        var limitCount = req.query.limit;
        var sinceId = req.query.since;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        if(sinceId)
        {
            if(limitCount)
            {
                InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, has_read: 'false', message_state: 'RECEIVED', _id: { $gt: sinceId }})
                    .limit(limitCount)
                    .populate('engagement_session')
                    .exec(SendGetMessagesResponse.bind(this, res, reqId));
            }
            else
            {
                InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, has_read: 'false', message_state: 'RECEIVED', _id: { $gt: sinceId }})
                    .populate('engagement_session')
                    .exec(SendGetMessagesResponse.bind(this, res, reqId));
            }
        }
        else
        {
            if(limitCount)
            {
                InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, has_read: 'false', message_state: 'RECEIVED'})
                    .limit(limitCount)
                    .populate('engagement_session')
                    .exec(SendGetMessagesResponse.bind(this, res, reqId));
            }
            else
            {
                InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, has_read: 'false', message_state: 'RECEIVED'})
                    .populate('engagement_session')
                    .exec(SendGetMessagesResponse.bind(this, res, reqId));
            }
        }



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, emptyArr);
        logger.error('[DVP-Interactions.GetUnReadMessages] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

};

function GetReadMessages(req, res, next)
{
    var reqId = uuid.v1();
    var emptyArr = [];
    try
    {
        logger.debug('[DVP-Interactions.GetReadMessages] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var profileId = req.params.profileId;
        var limitCount = req.query.limit;
        var sinceId = req.query.since;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        if(sinceId)
        {
            if(limitCount)
            {
                InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, has_read: 'true', message_state: 'RECEIVED', _id: { $gt: sinceId }})
                    .limit(limitCount)
                    .populate('engagement_session')
                    .exec(SendGetMessagesResponse.bind(this, res, reqId));
            }
            else
            {
                InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, has_read: 'true', message_state: 'RECEIVED', _id: { $gt: sinceId }})
                    .populate('engagement_session')
                    .exec(SendGetMessagesResponse.bind(this, res, reqId));
            }
        }
        else
        {
            if(limitCount)
            {
                InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, has_read: 'true', message_state: 'RECEIVED'})
                    .limit(limitCount)
                    .populate('engagement_session')
                    .exec(SendGetMessagesResponse.bind(this, res, reqId));
            }
            else
            {
                InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, has_read: 'true', message_state: 'RECEIVED'})
                    .populate('engagement_session')
                    .exec(SendGetMessagesResponse.bind(this, res, reqId));
            }
        }



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, emptyArr);
        logger.error('[DVP-Interactions.GetReadMessages] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

};

function GetDeletedMessages(req, res, next)
{
    var reqId = uuid.v1();
    var emptyArr = [];
    try
    {
        logger.debug('[DVP-Interactions.GetDeletedMessages] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var profileId = req.params.profileId;
        var limitCount = req.query.limit;
        var sinceId = req.query.since;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        if(sinceId)
        {
            if(limitCount)
            {
                InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, message_state: 'DELETED', _id: { $gt: sinceId }})
                    .limit(limitCount)
                    .populate('engagement_session')
                    .exec(SendGetMessagesResponse.bind(this, res, reqId));
            }
            else
            {
                InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, message_state: 'DELETED', _id: { $gt: sinceId }})
                    .populate('engagement_session')
                    .exec(SendGetMessagesResponse.bind(this, res, reqId));
            }
        }
        else
        {
            if(limitCount)
            {
                InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, message_state: 'DELETED'})
                    .limit(limitCount)
                    .populate('engagement_session')
                    .exec(SendGetMessagesResponse.bind(this, res, reqId));
            }
            else
            {
                InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, message_state: 'DELETED'})
                    .populate('engagement_session')
                    .exec(SendGetMessagesResponse.bind(this, res, reqId));
            }
        }



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, emptyArr);
        logger.error('[DVP-Interactions.GetDeletedMessages] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

};



module.exports.AddMessageToInbox = AddMessageToInbox;
module.exports.GetUnreadMessages = GetUnreadMessages;
module.exports.GetReadMessages = GetReadMessages;
module.exports.GetDeletedMessages = GetDeletedMessages;
module.exports.SetMessageAsRead = SetMessageAsRead;
module.exports.DeleteMessage = DeleteMessage;
