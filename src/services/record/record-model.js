'use strict';

// record-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const record = sequelize.define('records', {
    time: {
      type: Sequelize.TIME,
      allowNull: false
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    distance: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }, {
    freezeTableName: true
  });

  record.sync();

  return record;
};
