// Dépendances
const models = require('../models')
const fs = require('fs')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const secretToken = process.env.TOKEN

// créer un commentaire
exports.createComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({ where: { id: decodedToken.userId } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: '404 - User not found' })
            }
            models.Post.findOne({ where: { id: req.params./* post */id } })
                .then(post => {
                    if (!post) {
                        return res.status(404).json({ error: '404 - Post not found' })
                    }

                    let content = req.body.content

                    models.Comment.create({
                        content: content,
                        user_id: user.id,
                        post_id: post.id
                    })
                        .then(() => res.status(201).json({ message: 'Comment created with success on this post - post_id: ' + post.id }))
                        .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))
                })
                .catch(error => res.status(500).json({ error: 'B - 500 - ' + error }))
        })
}

// modifier un commentaire
exports.modifyComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({ where: { id: decodedToken.userId } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: '404 - User not found' })
            }

            models.Post.findOne({ where: { id: req.params./* post */id } })
                .then(post => {
                    if (!post) {
                        return res.status(404).json({ error: '404 - Post not found' })
                    }

                    models.Comment.findOne({ where: { id: req.params./* comment */id } })
                        .then(comment => {
                            if (!comment) {
                                return res.status(404).json({ error: '404 - Comment not found' })
                            }

                            let content = req.body.content ? req.body.content : comment.content

                            if(comment.user_id !== user.id) {
                                return res.status(401).json({ error: '401 - You aren\'t authorized' })
                            }

                            comment.update({
                                content: content,
                                updatedAt: Date.now()
                            })
                                .then(() => res.status(200).json({ message: 'Comment has been modified' }))
                                .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))

                        })
                        .catch(error => res.status(500).json({ error: 'B - 500 - ' + error }))

                })
                .catch(error => res.status(500).json({ error: 'C - 500 - ' + error }))

        })
        .catch(error => res.status(500).json({ error: 'D - 500 - ' + error }))
}

// supprimer un commentaire
exports.deleteComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({ where: { id: decodedToken.userId } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: '404 - User not found' })
            }

            models.Post.findOne({ where: { id: req.params./* post */id } })
                .then(post => {
                    if (!post) {
                        return res.status(404).json({ error: '404 - Post not found' })
                    }

                    models.Comment.findOne({ where: { id: req.params./* comment */id } })
                        .then(comment => {
                            if (!comment) {
                                return res.status(404).json({ error: '404 - Comment not found' })
                            }

                            if(comment.user_id !== user.id) {
                                return res.status(401).json({ error: '401 - You aren\'t authorized' })
                            }

                            models.Comment.destroy({ where: { id : req.params./* comment */id } })
                                .then(() => res.status(200).json({ message: 'Comment deleted with success' }))
                                .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))

                        })
                        .catch(error => res.status(500).json({ error: 'B - 500 - ' + error }))

                })
                .catch(error => res.status(500).json({ error: 'C - 500 - ' + error }))

        })
        .catch(error => res.status(500).json({ error: 'D - 500 - ' + error }))
}

// récupérer un commentaire
exports.getOneComment = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({ where: { id: decodedToken.userId } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: '404 - User not found' })
            }

            models.Post.findOne({ where: { id: req.params./* post */id } })
                .then(post => {
                    if (!post) {
                        return res.status(404).json({ error: '404 - Post not found' })
                    }

                    models.Comment.findOne({ where: 
                        { id: req.params./* comment */id },
                        include: {
                            model: models.User,
                            attributes: ['firstName', 'lastName', 'profilePicture'],
                            where: {
                                id: {[Op.col] : 'Comment.user_id'}
                            }
                        }
                    })

                        .then(comment => {
                            if (!comment) {
                                return res.status(404).json({ error: '404 - Comment not found' })
                            }
                            res.status(200).send(comment)
                        })
                        .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))
    
                })
                .catch(error => res.status(500).json({ error: 'B - 500 - ' + error }))
            
        })
        .catch(error => res.status(500).json({ error: 'C - 500 - ' + error }))
}

// récupérer tous les commentaires
exports.getAllComments = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({ where: { id: decodedToken.userId } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: '404 - User not found' })
            }

            models.Post.findOne({ where: { id: req.params./* post */id } })
                .then(post => {
                    if (!post) {
                        return res.status(404).json({ error: '404 - Post not found' })
                    }

                    models.Comment.findOne({ where: 
                        { id: req.params./* post */id },
                        include: {
                            model: models.User,
                            attributes: ['firstName', 'lastName', 'profilePicture'],
                            where: {
                                id: {[Op.col] : 'Comment.user_id'}
                            }
                        },
                        order: [
                            ['createdAt', 'ASC'],
                        ]
                    })

                        .then(comment => {
                            if (!comment) {
                                return res.status(404).json({ error: '404 - Comment not found' })
                            }
                            res.status(200).send(comment)
                        })
                        .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))
    
                })
                .catch(error => res.status(500).json({ error: 'B - 500 - ' + error }))
            
        })
        .catch(error => res.status(500).json({ error: 'C - 500 - ' + error }))
}