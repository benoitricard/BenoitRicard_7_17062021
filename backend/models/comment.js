'use strict'

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    post_id: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    freezeTableName: true
  })

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: 'user_id' })
    Comment.belongsTo(models.Post, { foreignKey: 'post_id' })
  }

  return Comment
}