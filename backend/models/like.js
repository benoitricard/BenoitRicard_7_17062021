'use strict'

module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      freezeTableName: true
    })
  
    Like.associate = (models) => {
        Like.belongsTo(models.User, { foreignKey: 'user_id' })
        Like.belongsTo(models.Post, { foreignKey: 'post_id' })
    }
  
    return Like
  }