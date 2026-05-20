'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Commentary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Match,{
        foreignKey:"matchId",
        onDelete:'CASCADE'
      })
    }
  }
  Commentary.init({
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    actor: DataTypes.STRING,
    message: DataTypes.STRING,
    minute: DataTypes.INTEGER,
    sequenceNo: DataTypes.INTEGER,
    details: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Commentary',
  });
  return Commentary;
};