'use strict';

// user-model.js - A sequelize model
//
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const user = sequelize.define('users', {
    uuid: {
      type: Sequelize.UUID,
      unique: true,
      primaryKey: true,
      isUUID: 4,
      defaultValue: Sequelize.UUIDV4
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      defaultValue: 1,
      allowNull: false
    }
  }, {
    freezeTableName: true
  });

  user.sync();

  return user;
};
