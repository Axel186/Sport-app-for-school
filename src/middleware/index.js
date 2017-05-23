'use strict';

const handler = require('feathers-errors/handler');
const notFound = require('./not-found-handler');
const logger = require('./logger');

module.exports = function() {
  // Add your custom middleware here. Remember, that
  // just like Express the order matters, so error
  // handling middleware should go last.
  const app = this;

  // SPA - every 404 goes here and call static files.
  app.use(
    function(req, res) {
      var path = req.params[0] ? req.params[0] : 'index.html';
      res.sendFile(path, {
        root: app.get('public')
      });
    }
  );

  app.use(notFound());
  app.use(logger(app));
  app.use(handler());
};
