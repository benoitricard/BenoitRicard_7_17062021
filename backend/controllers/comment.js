const Comment = require('../models/Comment')
const { Sequelize } = require('sequelize')

exports.createComment = (req, res, next) => {
    // INSERT INTO comment (date_comment, utilisateur_id, post_id, content)
    // VALUES
    // ('Le %d/%m/%Y, à %H:%i', 'utilisateur_id', 'post_id', 'lorem ipsum')
}

exports.modifyComment = (req, res, next) => {

}

exports.deleteComment = (req, res, next) => {
    // DROP * FROM comment WHERE comment.id = actual_comment
}

exports.getAllComments = (req, res, next) => {
    // SELECT * FROM comment
    // JOIN utilisateur ON comment.utilisateur_id = utilisateur.id
    // JOIN post ON comment.post_id = post.id
    // WHERE comment.post_id = actual_post
}