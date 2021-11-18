// Dépendances
const models = require('../models')
const fs = require('fs')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const secretToken = process.env.TOKEN

// liker un post
exports.likePost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({ where: { id : decodedToken.userId } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: '404 - User not found' })
            }
            models.Post.findOne({ where: { id: req.params.id } })
                .then(post => {
                    if (!post) {
                        return res.status(404).json({ error: '404 - Post not found' })
                    }
                    models.Like.findOne({ where: { id: req.params.id } })
                        .then(like => {
                            if (!like) { // si le like n'existe pas, on le crée
                                models.Like.create({
                                    user_id: user.id,
                                    post_id: post.id,
                                    createdAt: Date.now()
                                })
                                    .then(() => res.status(201).json({ message: 'Like added to this post - post_id: ' + post }))
                                    .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))
                                
                                post.update({
                                    nbOfLikes: +1
                                })
                                    .then(() => res.status(201).json({ message: 'Number of likes updated on this post - post_id: ' + post }))
                                    .catch(error => res.status(500).json({ error: 'B - 500 - ' + error }))

                            } // s'il existe déjà, on le supprime
                                like.destroy()
                                    .then(() => res.status(201).json({ message: 'Like deleted to this post - post_id: ' + post }))
                                    .catch(error => res.status(500).json({ error: 'C - 500 - ' + error }))

                                post.update({
                                    nbOfLikes: -1
                                })
                                    .then(() => res.status(201).json({ message: 'Number of likes updated on this post - post_id: ' + post }))
                                    .catch(error => res.status(500).json({ error: 'D - 500 - ' + error }))
                        })
                })
        })
}

// récupérer tous les likes d'un post
exports.getAllLikes = (req, res) => {
    models.Post.findOne({ where: { id: req.params.id } })
        .then(post => {
            if (!post) {
                return res.status(404).json({ error: '404 - Post not found' })
            }
            models.Like.findAll({
                attributes: [ 'id', 'user_id', 'post_id' ],
                order: [
                   ['createdAt', 'ASC']
                ]
            })
            .then(likes => {
                if (!likes) {
                    return res.status(404).json({ error: '404 - No likes found on this post - post_id: ' + post })
                }
                res.status(200).send(likes)
            })
            .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))
        })
}