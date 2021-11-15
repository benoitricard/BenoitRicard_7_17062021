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
  return User
}