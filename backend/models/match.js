import { Model } from 'sequelize';
import { match_statusEnums } from '../Utils/index.js';

const { LIVE, FINISHED, SCHEDULED } = match_statusEnums;

export default (sequelize, DataTypes) => {

  class Match extends Model {
    static associate(models) {
      // associations here later
      this.hasMany(models.Commentary,{
        foreignKey:"matchId",
        onDelete:'CASCADE'
      })
    }
  }

  Match.init({
    HomeTeam: {
      type: DataTypes.STRING,
      allowNull: false
    },

    AwayTeam: {
      type: DataTypes.STRING,
      allowNull: false
    },

    Sport: {
      type: DataTypes.STRING,
      allowNull: false
    },

    StartTime: {
      type: DataTypes.DATE,
      allowNull: false
    },

    Status: {
      type: DataTypes.ENUM(
        LIVE,
        FINISHED,
        SCHEDULED
      ),
      allowNull: false,
      defaultValue: SCHEDULED
    },

    HomeScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    AwayScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }

  }, {
    sequelize,
    modelName: 'Match',
    timestamps: true
  });

  return Match;
};