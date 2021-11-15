'use strict'

const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
const db = {}
require('dotenv').config()

// Données cachées (dotenv)
const sqUser = process.env.SEQUELIZE_USER
const sqPassword = process.env.SEQUELIZE_PASSWORD
const sqHost = process.env.SEQUELIZE_HOST

// BDD AlwaysData
let sequelize = new Sequelize('benoitricard_groupomania', sqUser, sqPassword, {
    host: sqHost,
    dialect: 'mariadb'
})

try { // Test de la connexion à la BDD
    sequelize.authenticate()
    console.log('Connection has been established successfully.')
} catch (error) {
    console.error('Unable to connect to the database: ', error)
}

fs
.readdirSync(__dirname)
.filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
})
.forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
})

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db