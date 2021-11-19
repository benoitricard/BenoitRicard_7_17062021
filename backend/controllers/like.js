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
                return res.status(404).json({ error: 'TOKEN' })
            }
            models.Post.findOne({ where: { id: req.params.postid } })
                .then(post => {
                    if (!post) {
                        return res.status(404).json({ error: 'POST NOT FOUND' })
                    }
                    models.Like.findOne({ where: { user_id: user.id } })
                        .then(like => {
                            if (!like) { // si le like n'existe pas, on le crée
                                models.Like.create({
                                    user_id: user.id,
                                    post_id: post.id
                                })
                                    .then(() => res.status(201).json())
                                    .catch(error => res.status(500).json({ error: 'A - ' + error }))
                                
                                post.update({
                                    nbOfLikes: post.nbOfLikes +1
                                })
                                    .then(() => res.status(201).json())
                                    .catch(error => res.status(500).json({ error: 'B - ' + error }))

                            } else { // s'il existe déjà, on le supprime
                                like.destroy()
                                    .then(() => res.status(201).json())
                                    .catch(error => res.status(500).json({ error: 'C - ' + error }))

                                post.update({
                                    nbOfLikes: post.nbOfLikes -1
                                })
                                    .then(() => res.status(201).json())
                                    .catch(error => res.status(500).json({ error: 'D - ' + error }))
                            }
                        })
                        .catch(error => res.status(500).json({ error: 'E - ' + error }))
                })
                .catch(error => res.status(500).json({ error: 'F - ' + error }))
        })
        .catch(error => res.status(500).json({ error: 'G - ' + error }))
}

exports.getOneLike = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({ where: { id : decodedToken.userId } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'TOKEN' })
            }
            models.Like.findOne({ where: { id : req.params.id } })
                .then(like => {
                    if (!like) {
                        return res.status(404).json({ error: 'LIKE NOT FOUND' })
                    }
                    res.status(200).send(like)
                })
                .catch(error => res.status(500).json({ error: 'A - ' + error }))
        })
        .catch(error => res.status(500).json({ error: 'B - ' + error }))
}