'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Match.init({
    ID: DataTypes.INTEGER,
    HomeTeam: DataTypes.STRING,
    AwayTeam: DataTypes.STRING,
    Sport: DataTypes.STRING,
    StartTime: DataTypes.DATE,
    Status: DataTypes.ENUM,
    HomeScore: DataTypes.INTEGER,
    AwayScore: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Match',
  });
  return Match;
};