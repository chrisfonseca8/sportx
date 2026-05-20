'use strict';

import { match_statusEnums } from '../Utils/index.js';

const { LIVE, FINISHED, SCHEDULED } = match_statusEnums;

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Matches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      HomeTeam: {
        type: Sequelize.STRING,
        allowNull: false
      },

      AwayTeam: {
        type: Sequelize.STRING,
        allowNull: false
      },

      Sport: {
        type: Sequelize.STRING,
        allowNull: false
      },

      StartTime: {
        type: Sequelize.DATE,
        allowNull: false
      },

      Status: {
        type: Sequelize.ENUM(LIVE, FINISHED, SCHEDULED),
        allowNull: false,
        defaultValue: SCHEDULED
      },

      HomeScore: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },

      AwayScore: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Matches');
  }
};