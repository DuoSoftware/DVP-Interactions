/**
 * Created by dinusha on 7/15/2016.
 */

//var mongoose = require('mongoose');
var logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
var InboxMessage = require('dvp-mongomodels/model/UserInbox').InboxMessage;
//var User = require('dvp-mongomodels/model/User');
var messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var uuid = require('node-uuid');
var async = require('async');
var UserAccount = require('dvp-mongomodels/model/UserAccount');

//var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

function AddMessageToInbox(req, res, next)
{
    var reqId = uuid.v1();
    try
    {
        logger.debug('[DVP-Interactions.AddMessageToInbox] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var profileId = req.body.profile;
        var issuer = req.body.issuer;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        var query = {company: companyId, tenant: tenantId, userref: profileId};

        if(issuer)
        {
            query = {company: companyId, tenant: tenantId, user: issuer}
        }

        UserAccount.findOne(query).populate('userref', '-password').exec(function(err, user)
        {
            if(user)
            {

                var inboxMsg = InboxMessage({

                    engagement_session: req.body.engagementSession,
                    profile: user.userref._id,
                    message: req.body.message,
                    from: req.body.from,
                    has_read: false,
                    has_replied: false,
                    message_type: req.body.msgType,
                    heading: req.body.heading,
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
            else
            {
                var jsonString = messageFormatter.FormatMessage(new Error('User not found'), "User not found", false, false);
                logger.debug('[DVP-Interactions.AddMessageToInbox] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

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

}

function SetMessageAsRead(req, res, next)
{
    var reqId = uuid.v1();
    try
    {
        logger.debug('[DVP-Interactions.SetMessageAsRead] - [%s] - HTTP Request Received', reqId);

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

}

var deleteSingleMessage = function(messageId, companyId, tenantId, profileId, callback)
{
    InboxMessage.findOneAndUpdate(
        {company: companyId, tenant: tenantId, _id: messageId, profile: profileId},
        {
            message_state: 'DELETED'

        }, function (err, inboxObj)
        {
            callback(null, true);

        });
};

function DeleteMessages(req, res, next)
{
    var reqId = uuid.v1();
    try
    {
        logger.debug('[DVP-Interactions.DeleteMessage] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var profileId = req.params.profileId;
        var msgIds = null;

        if(typeof req.body === 'string')
        {
            msgIds = JSON.parse(req.body).messageIds;
        }
        else
        {
            msgIds = req.body.messageIds;
        }

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        var asyncFuncArr = [];

        msgIds.forEach(function(msgId)
        {
            asyncFuncArr.push(deleteSingleMessage.bind(this, msgId, companyId, tenantId, profileId));
        });

        async.parallel(asyncFuncArr, function(err, results)
        {
            if(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "Error deleting messages", false, false);
                logger.error('[DVP-Interactions.DeleteMessage] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
            else
            {
                var jsonString = messageFormatter.FormatMessage(null, "Messages deleted successfully", true, true);
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

}

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
};

var getUnreadCount = function(profileId, companyId, tenantId, callback)
{
    InboxMessage.count({company: companyId, tenant: tenantId, profile: profileId, has_read: 'false', message_state: 'RECEIVED'},
        function (err, unreadCount)
        {
            callback(err, unreadCount);
        });
};

var getReadCount = function(profileId, companyId, tenantId, callback)
{
    InboxMessage.count({company: companyId, tenant: tenantId, profile: profileId, has_read: 'true', message_state: 'RECEIVED'},
        function (err, unreadCount)
        {
            callback(err, unreadCount);
        });
};

var getAllCount = function(profileId, companyId, tenantId, callback)
{
    InboxMessage.count({company: companyId, tenant: tenantId, profile: profileId, message_state: 'RECEIVED'},
        function (err, allCount)
        {
            callback(err, allCount);
        });
};

var getDeleteCount = function(profileId, companyId, tenantId, callback)
{
    InboxMessage.count({company: companyId, tenant: tenantId, profile: profileId, message_state: 'DELETED'},
        function (err, allCount)
        {
            callback(err, allCount);
        });
};

var getCountByType = function(profileId, companyId, tenantId, msgType, callback)
{
    InboxMessage.count({company: companyId, tenant: tenantId, profile: profileId, message_state: 'RECEIVED', message_type: msgType},
        function (err, allCount)
        {
            callback(err, allCount);
        });
};


function GetMessageInboxCounts(req, res, next)
{
    var reqId = uuid.v1();
    var emptyArr = [];
    try
    {
        logger.debug('[DVP-Interactions.GetInboxCounts] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var profileId = req.params.profileId;
        var arr = [];

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        arr.push(getUnreadCount.bind(this, profileId, companyId, tenantId));
        arr.push(getAllCount.bind(this, profileId, companyId, tenantId));
        arr.push(getDeleteCount.bind(this, profileId, companyId, tenantId));
        arr.push(getCountByType.bind(this, profileId, companyId, tenantId, 'FACEBOOK'));
        arr.push(getCountByType.bind(this, profileId, companyId, tenantId, 'TWITTER'));
        arr.push(getCountByType.bind(this, profileId, companyId, tenantId, 'NOTIFICATION'));
        arr.push(getReadCount.bind(this, profileId, companyId, tenantId));
        arr.push(getCountByType.bind(this, profileId, companyId, tenantId, 'SMS'));

        async.parallel(arr, function(err, results)
        {
            if(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, null);
                logger.error('[DVP-Interactions.GetUnReadMessages] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);
            }
            else
            {
                if(results && results.length === 8)
                {
                    var countsObj = {
                        UNREAD: results[0],
                        INBOX: results[1],
                        DELETED: results[2],
                        FACEBOOK: results[3],
                        TWITTER: results[4],
                        NOTIFICATION: results[5],
                        READ: results[6],
                        SMS: results[7]
                    };

                    var jsonString = messageFormatter.FormatMessage(null, "SUCCESS", true, countsObj);
                    logger.debug('[DVP-Interactions.GetUnReadMessages] - [%s] - API RESPONSE : %s', reqId, jsonString);
                    res.end(jsonString);
                }
                else
                {
                    var jsonString = messageFormatter.FormatMessage(null, "SUCCESS", true, null);
                    logger.error('[DVP-Interactions.GetUnReadMessages] - [%s] - API RESPONSE : %s', reqId, jsonString);
                    res.end(jsonString);
                }
            }

        });


    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, emptyArr);
        logger.error('[DVP-Interactions.GetUnReadMessages] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

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
        var skipCount = req.query.skip;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        if(limitCount)
        {
            InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, has_read: 'false', message_state: 'RECEIVED'})
                .sort({received_at: 'descending'})
                .skip(skipCount)
                .limit(limitCount)
                .populate('engagement_session')
                .exec(SendGetMessagesResponse.bind(this, res, reqId));
        }
        else
        {
            InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, has_read: 'false', message_state: 'RECEIVED'})
                .sort({received_at: 'descending'})
                .populate('engagement_session')
                .exec(SendGetMessagesResponse.bind(this, res, reqId));
        }



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, emptyArr);
        logger.error('[DVP-Interactions.GetUnReadMessages] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

}

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
        var skipCount = req.query.skip;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        if(limitCount)
        {
            InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, has_read: 'true', message_state: 'RECEIVED'})
                .sort({received_at: 'descending'})
                .skip(skipCount)
                .limit(limitCount)
                .populate('engagement_session')
                .exec(SendGetMessagesResponse.bind(this, res, reqId));
        }
        else
        {
            InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, has_read: 'true', message_state: 'RECEIVED'})
                .sort({received_at: 'descending'})
                .populate('engagement_session')
                .exec(SendGetMessagesResponse.bind(this, res, reqId));
        }



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, emptyArr);
        logger.error('[DVP-Interactions.GetReadMessages] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

}

function GetInboxMessages(req, res, next)
{
    var reqId = uuid.v1();
    var emptyArr = [];
    try
    {
        logger.debug('[DVP-Interactions.GetInboxMessages] - [%s] - HTTP Request Received', reqId);

        var companyId = req.user.company;
        var tenantId = req.user.tenant;
        var profileId = req.params.profileId;
        var limitCount = req.query.limit;
        var skipCount = req.query.skip;
        var msgType = req.query.messageType;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        var cond = {company: companyId, tenant: tenantId, profile: profileId, message_state: 'RECEIVED'};

        if(msgType)
        {
            cond.message_type = msgType;
        }

        if(limitCount)
        {
            InboxMessage.find(cond)
                .sort({received_at: 'descending'})
                .skip(skipCount)
                .limit(limitCount)
                .populate('engagement_session')
                .exec(SendGetMessagesResponse.bind(this, res, reqId));
        }
        else
        {
            InboxMessage.find(cond)
                .sort({received_at: 'descending'})
                .populate('engagement_session')
                .exec(SendGetMessagesResponse.bind(this, res, reqId));
        }



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, emptyArr);
        logger.error('[DVP-Interactions.GetInboxMessages] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

}


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
        var skipCount = req.query.skip;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        if(limitCount)
        {
            InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, message_state: 'DELETED'})
                .sort({received_at: 'descending'})
                .skip(skipCount)
                .limit(limitCount)
                .populate('engagement_session')
                .exec(SendGetMessagesResponse.bind(this, res, reqId));
        }
        else
        {
            InboxMessage.find({company: companyId, tenant: tenantId, profile: profileId, message_state: 'DELETED'})
                .sort({received_at: 'descending'})
                .populate('engagement_session')
                .exec(SendGetMessagesResponse.bind(this, res, reqId));
        }



    }
    catch(ex)
    {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, emptyArr);
        logger.error('[DVP-Interactions.GetDeletedMessages] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();

}



module.exports.AddMessageToInbox = AddMessageToInbox;
module.exports.GetUnreadMessages = GetUnreadMessages;
module.exports.GetReadMessages = GetReadMessages;
module.exports.GetDeletedMessages = GetDeletedMessages;
module.exports.SetMessageAsRead = SetMessageAsRead;
module.exports.DeleteMessages = DeleteMessages;
module.exports.GetInboxMessages = GetInboxMessages;
module.exports.GetMessageInboxCounts = GetMessageInboxCounts;
