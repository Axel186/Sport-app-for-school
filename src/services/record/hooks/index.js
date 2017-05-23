'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const errors = require('feathers-errors');

const moment = require("moment");

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    function(hook, next) {
      // Only owner can see this record
      var req_userId = (hook.params.query && hook.params.query.userId) ? hook.params.query.userId : null;
      if (hook.data && hook.data.userId) {
        req_userId = hook.data.userId;
      }

      // Get only mine records.
      if (req_userId && req_userId != hook.params.user.uuid) {} else {
        hook.params.query.userId = hook.params.user.uuid;
      }

      next(null, hook);
    }
  ],
  find: [
    function(hook, next) {
      if (hook.params.query.userId != hook.params.user.uuid && hook.params.user.type != 3) {
        return next(new errors.Forbidden("You don't have permissions."), hook);
      } else {
        next(null, hook);
      }
    },
    function(hook, next) {
      var query_from;
      var query_to;

      // Check if range date parameters are valid.
      if (!hook.params.query.from || !hook.params.query.to) {
        return next(new errors.MethodNotAllowed("Invalid range, please check your query."), hook);
      } else {
        query_from = new Date(parseInt(hook.params.query.from));
        query_to = new Date(parseInt(hook.params.query.to));

        if (query_from == "Invalid Date" || query_to == "Invalid Date") {
          return next(new errors.MethodNotAllowed("Invalid range, please check your query."), hook);
        }
      }

      // Records are sorted by date.
      hook.params.query.$sort = {
        date: -1
      };

      // Filter by dates.
      hook.params.query.date = {
        $gte: query_from,
        $lte: query_to,
      };

      // Remove filters from query
      delete hook.params.query.from;
      delete hook.params.query.to;

      next(null, hook);
    }
  ],
  get: [
    auth.restrictToRoles({
      roles: ['3'],
      fieldName: 'type',
      idField: 'uuid',
      ownerField: 'userId',
      owner: true
    })
  ],
  create: [
    function(hook, next) {
      if (!hook.data.userId) {
        hook.data.userId = hook.params.user.uuid;
      }

      if (hook.data.userId != hook.params.user.uuid && hook.params.user.type != 3) {
        return next(new errors.Forbidden("You don't have permissions."), hook);
      }

      next(null, hook);
    },
    function(hook, next) {
      var validate_error = validate(hook);
      if (validate_error) {
        return next(validate_error, hook);
      }

      next(null, hook);
    }
  ],
  update: [
    function(hook) {
      next(new errors.MethodNotAllowed("Not in use."), hook);
    }
  ],
  patch: [
    auth.restrictToRoles({
      roles: ['3'],
      fieldName: 'type',
      idField: 'uuid',
      ownerField: 'userId',
      owner: true
    }),
    // function(hook, next) {
    //   var recordService = hook.app.service('/api/records');
    //   recordService.get(hook.id, hook)
    //     .then(function(result) {
    //       if (result.userId != hook.params.user.uuid) {
    //         havePermissionToUser(result.userId, hook, next);
    //       } else {
    //         next(null, hook);
    //       }
    //     })
    //     .catch(function(err) {
    //       next(new errors.MethodNotAllowed("Record not found, please check your query."), hook);
    //     })
    // },
    function(hook, next) {
      delete hook.params.query.userId;

      var validate_error = validate(hook);
      next(validate_error, hook);
    }
  ],
  remove: [
    function(hook, next) {
      hook.id = hook.params.query.id;
      delete hook.params.query.userId;
      console.log(hook.id);
      next(null, hook);
    },
    auth.restrictToRoles({
      roles: ['3'],
      fieldName: 'type',
      idField: 'uuid',
      ownerField: 'userId',
      owner: true
    }),
  ]
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};


function havePermissionToUser(req_userId, hook, next) {
  var userService = hook.app.service('/api/users');
  // Check if user exists
  userService.get(req_userId)
    .then(function(result) {
      // Check user got permissions.
      if (hook.params.user.type != 3) {
        return next(new errors.MethodNotAllowed("You don't have permissions."), hook);
      }

      next(null, hook);
    })
    .catch(function(err) {
      return next(new errors.MethodNotAllowed("You don't have permissions."), hook);
    });
}

function validate(hook) {
  var error;

  if (hook.method == "create" || (hook.method == "patch" && hook.data.date)) {
    error = (validateDate(hook)) ? validateDate(hook) : error;
  }
  if (hook.method == "create" || (hook.method == "patch" && hook.data.time)) {
    error = (validateTime(hook)) ? validateTime(hook) : error;
  }
  if (hook.method == "create" || (hook.method == "patch" && hook.data.distance)) {
    error = (validateDistance(hook)) ? validateDistance(hook) : error;
  }

  return error;
}

function validateDate(hook) {
  var date = new Date(hook.data.date);
  if (date == "Invalid Date") {
    return new errors.MethodNotAllowed("Invalid date, please check your query.");
  }

  return null;
}

function validateTime(hook) {
  var time = moment(hook.data.time, "HH:mm:ss");
  if (!time.isValid()) {
    return new errors.MethodNotAllowed("Invalid time, please check your query.");
  }
  hook.data.time = time.format("HH:mm:ss");

  return null;
}

function validateDistance(hook) {
  hook.data.distance = parseInt(hook.data.distance);
  if (!hook.data.distance) {
    return new errors.MethodNotAllowed("Invalid distance value, please check your query.");
  }

  return null;
}
