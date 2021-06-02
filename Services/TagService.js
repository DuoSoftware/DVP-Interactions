var logger = require("dvp-common-lite/LogHandler/CommonLogHandler.js").logger;
var messageFormatter = require("dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js");
var TagMaster = require("dvp-mongomodels/model/EngagementTag").TagMaster;
var UserAccount = require("dvp-mongomodels/model/UserAccount");
var EngagementSession =
  require("dvp-mongomodels/model/Engagement").EngagementSession;

function GetTagMasters(req, res) {
  logger.debug("DVP-Interactions.GetTagMasters Internal method ");
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  var jsonString;
  TagMaster.find(
    { company: company, tenant: tenant, active: true },
    function (err, tagMaster) {
      if (err) {
        jsonString = messageFormatter.FormatMessage(
          err,
          "Get TagMasters Failed",
          false,
          undefined
        );
      } else {
        if (tagMaster) {
          jsonString = messageFormatter.FormatMessage(
            err,
            "Get TagMasters Successful",
            true,
            tagMaster
          );
        } else {
          jsonString = messageFormatter.FormatMessage(
            undefined,
            "No TagMasters Found",
            false,
            undefined
          );
        }
      }

      res.end(jsonString);
    }
  );
}

function GetTagMaster(req, res) {
  logger.debug("DVP-Interactions.GetTagMaster Internal method ");
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  var jsonString;
  TagMaster.findOne(
    { company: company, tenant: tenant, tag: req.params.id },
    function (err, tagMaster) {
      if (err) {
        jsonString = messageFormatter.FormatMessage(
          err,
          "Get TagMaster Failed",
          false,
          undefined
        );
      } else {
        if (tagMaster) {
          jsonString = messageFormatter.FormatMessage(
            err,
            "Get TagMaster Successful",
            true,
            tagMaster
          );
        } else {
          jsonString = messageFormatter.FormatMessage(
            undefined,
            "No TagMaster Found",
            false,
            undefined
          );
        }
      }

      res.end(jsonString);
    }
  );
}

function DeleteTagMaster(req, res) {
  logger.debug("DVP-Interactions.DeleteEngagement Internal method ");

  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  var jsonString;

  TagMaster.findOneAndUpdate(
    {
      tag: req.params.id,
      company: company,
      tenant: tenant,
    },
    {
      active: false,
    },
    { useFindAndModify: false },
    function (err, tagMaster) {
      if (err) {
        jsonString = messageFormatter.FormatMessage(
          err,
          "Delete TagMaster failed",
          false,
          undefined
        );
      } else {
        jsonString = messageFormatter.FormatMessage(
          undefined,
          "Delete TagMaster Success",
          true,
          undefined
        );
      }
      res.end(jsonString);
    }
  );
}

function UpdateTagMaster(req, res) {
  logger.debug("DVP-Interactions.DeleteEngagement Internal method ");

  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  var jsonString;

  let obj = req.body;
  obj.updated_at = Date.now();

  TagMaster.findOneAndUpdate(
    {
      tag: req.params.id,
      company: company,
      tenant: tenant,
    },
    obj,
    { useFindAndModify: false },
    function (err, tagMaster) {
      if (err) {
        jsonString = messageFormatter.FormatMessage(
          err,
          "Delete TagMaster failed",
          false,
          undefined
        );
      } else {
        jsonString = messageFormatter.FormatMessage(
          undefined,
          "Delete TagMaster Success",
          true,
          undefined
        );
      }
      res.end(jsonString);
    }
  );
}

function CreateMasterTag(req, res) {
  logger.debug("DVP-Interactions.CreateMasterTag Internal method ");
  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  var jsonString;

  UserAccount.findOne({ user: req.user.iss, company: company, tenant: tenant })
    .populate("userref", "-password")
    .exec(function (err, useraccount) {
      if (err) {
        jsonString = messageFormatter.FormatMessage(
          err,
          "Get User Failed",
          false,
          undefined
        );
        res.end(jsonString);
      } else {
        if (useraccount && useraccount.userref) {
          var tagManager = TagMaster({
            tag: req.body.tag,
            description: req.body.description,
            company: company,
            tenant: tenant,
            created_at: Date.now(),
            updated_at: Date.now(),
            active: true,
            author: useraccount.userref.id,
          });

          tagManager.save(function (err, tagManager) {
            if (err) {
              jsonString = messageFormatter.FormatMessage(
                err,
                "Tag Master save failed",
                false,
                undefined
              );
              res.end(jsonString);
            } else {
              jsonString = messageFormatter.FormatMessage(
                undefined,
                "Add Tag Master Successful",
                true,
                tagManager
              );

              res.end(jsonString);
            }
          });
        } else {
          jsonString = messageFormatter.FormatMessage(
            err,
            "Get User Failed",
            false,
            undefined
          );
          res.end(jsonString);
        }
      }
    });
}

function AddTagToInteraction(req, res) {
  logger.debug("DVP-Interactions.AddTagToInteraction Internal method ");

  var company = parseInt(req.user.company);
  var tenant = parseInt(req.user.tenant);
  var jsonString;

  TagMaster.findOne(
    { company: company, tenant: tenant, tag: req.params.tag },
    function (err, tagMaster) {
      if (err) {
        jsonString = messageFormatter.FormatMessage(
          err,
          "Get TagMaster Failed",
          false,
          undefined
        );
      } else {
        if (tagMaster) {
          EngagementSession.findOneAndUpdate(
            {
              engagement_id: req.params.session,
              company: company,
              tenant: tenant,
            },
            { tag: tagMaster.tag },
            { useFindAndModify: false },
            function (err, tag) {
              if (err) {
                jsonString = messageFormatter.FormatMessage(
                  err,
                  "Append Tag To EngagementSession Failed",
                  false,
                  undefined
                );
              } else {
                jsonString = messageFormatter.FormatMessage(
                  undefined,
                  "Append Tag To EngagementSession Successful",
                  true,
                  tag
                );
              }

              res.end(jsonString);
            }
          );
        } else {
          jsonString = messageFormatter.FormatMessage(
            undefined,
            "No TagMaster Found",
            false,
            undefined
          );
          res.end(jsonString);
        }
      }
    }
  );
}

module.exports.GetTagMasters = GetTagMasters;
module.exports.GetTagMaster = GetTagMaster;
module.exports.DeleteTagMaster = DeleteTagMaster;
module.exports.UpdateTagMaster = UpdateTagMaster;
module.exports.CreateMasterTag = CreateMasterTag;
module.exports.AddTagToInteraction = AddTagToInteraction;
