'use strict'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      is: /^[a-zA-Z]*$/
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      is: /^[a-zA-Z]*$/
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      is: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profilePicture: {
      type: DataTypes.STRING
    },
    biography: {
      type: DataTypes.STRING
    },
    birthday: {
      type: DataTypes.DATE
    },
    jobTitle: {
      type: DataTypes.STRING
    },
    isAdmin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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

  User.associate = (models) => {
    User.hasMany(models.Post, { foreignKey: 'user_id' })
    User.hasMany(models.Comment, { foreignKey: 'user_id' })
    User.hasMany(models.Like, { foreignKey: 'user_id' })
  }

  return User
}