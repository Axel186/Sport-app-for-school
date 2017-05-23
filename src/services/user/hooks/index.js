'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const errors = require('feathers-errors');
const auth = require('feathers-authentication').hooks;

const bcrypt = require('bcryptjs');

const isEmail = require('eustia-module/isEmail');

exports.before = {
  all: [],
  find: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    function(hook, next) {
      if (hook.params.user) {
        if (hook.params.user.type < 2) {
          return next(new errors.Forbidden("You don't have permissions."), hook);
        }

        // Records are sorted by date.
        hook.params.query.$sort = {
          createdAt: 1
        };

        hook.params.query.type = {
          $lte: hook.params.user.type
        };

        hook.params.query.uuid = {
          $ne: hook.params.user.uuid
        };
      }

      next(null, hook);
    },
  ],
  get: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    function(hook, next) {
      if (Object.keys(hook.params).length) {
        if (hook.id == "mine") {
          hook.id = hook.params.user.uuid;
        } else {
          if (hook.params.user) {
            if (hook.params.user.type < 2) {
              return next(new errors.Forbidden("You don't have permissions."), hook);
            }
          }
        }
      }

      next(null, hook);
    }
  ],
  create: [
    function(hook, next) {
      if (!isEmail(hook.data.email)) {
        next(new errors.MethodNotAllowed("Please enter valid email address."), hook);
      }

      if (!hook.data.name || hook.data.name.length < 2 || hasNumber(hook.data.name)) {
        next(new errors.MethodNotAllowed("Please enter valid name."), hook);
      }

      if (!hook.data.password || hook.data.password.length < 8) {
        next(new errors.MethodNotAllowed("Password must be at least 8 characters."), hook);
      }

      next(null, hook);
    },
    auth.hashPassword()
  ],
  update: [
    function(hook, next) {
      next(new errors.MethodNotAllowed("Not in use."), hook);
    },
  ],
  patch: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),

    function(hook, next) {
      if (hook.id && hook.id != hook.params.user.uuid) {
        havePermissionToUser(hook.id, hook, next);
      } else {
        hook.id = hook.params.user.uuid;

        next(null, hook);
      }
    },
    function(hook, next) {
      if (hook.params.user.type > 1) {
        return next(null, hook);
      }

      // Password check.
      if (!hook.data.password) {
        hook.data.newPassword = false;
        return next(null, hook);
      }

      bcrypt.compare(hook.data.password, hook.params.user.password, function(err, result) {
        if (err || !result) {
          return next(new errors.MethodNotAllowed("Wrong current password"), hook);
        }

        next(null, hook);
      });
    },
    function functionName(hook, next) {
      if (hook.data.type > hook.params.user.type) {
        return next(new errors.MethodNotAllowed("Wrong type."), hook);
      }

      if (hook.data.email) {
        delete hook.data.email;
      }

      if (hook.data.newPassword) {
        hook.data.password = hook.data.newPassword;
        console.log("password changed");
      }

      next(null, hook);
    },
    auth.hashPassword()
  ],
  remove: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    function(hook, next) {
      var userId = hook.params.query.uuid;
      if (userId != hook.params.user.uuid) {
        havePermissionToUser(userId, hook, next);
      } else {
        return next(new errors.MethodNotAllowed("Can't remove yourself."), hook);
      }
    },
    function(hook, next) {
      var userService = hook.app.service('/api/users');

      userService.find({
          query: hook.params.query
        })
        .then((result) => {
          if (!result.data[0] || hook.params.user.type < result.data[0].type) {
            return next(new errors.Forbidden("No permissions."), hook);
          }

          next(null, hook);
        });
    },
  ]
};

exports.after = {
  all: [hooks.remove('password')],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};

function hasNumber(myString) {
  return /\d/.test(myString);
}

function havePermissionToUser(req_userId, hook, next) {
  var error = new errors.Forbidden("You don't have permissions.");
  if (hook.params.user.type < 2) {
    return next(error, hook);
  }

  var userService = hook.app.service('/api/users');

  // Check if user exists
  userService.get(req_userId)
    .then(function(result) {
      // Check user got permissions.
      if (hook.params.user.type < result.type) {
        return next(error, hook);
      }

      next(null, hook);
    })
    .catch(function(err) {
      return next(error, hook);
    });
}
