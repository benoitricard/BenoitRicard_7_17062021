// Dépendances
const models = require('../models')
const fs = require('fs')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const secretToken = process.env.TOKEN

exports.createComment = (req, res, next) => {
}

exports.modifyComment = (req, res, next) => {

}

exports.deleteComment = (req, res, next) => {
}

exports.getOneComment = (req, res, next) => {
}

exports.getAllComments = (req, res, next) => {
}