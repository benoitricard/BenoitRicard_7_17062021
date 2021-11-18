// Dépendances
const models = require('../models')
const fs = require('fs')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const secretToken = process.env.TOKEN

// Création d'un post
exports.createPost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)
    
    models.User.findOne({ where : { id: decodedToken.userId } })
        .then(user => {
            if(!user){
                return res.status(404).json({ error: '404 - User not found' })
            }

            let content = req.body.content
            let attachment = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`: null

            models.Post.create({
                content: content,
                attachment: attachment,
                user_id: user.id
            })
            .then(() =>  res.status(201).json({ message: 'Post created with success' }))
            .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))
        })
        .catch(error => res.status(500).json({ error: 'B - 500 - ' + error }))
}

// Modification d'un post
exports.modifyPost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({ where: { id : decodedToken.userId } })
    .then(user => {
        if(!user){
            return res.status(404).json({ error: '404 - User not found' })
        }
        models.Post.findOne({ where: { id : req.params.id } })
            .then(post => {
                if(!post){
                    return res.status(404).json({ error: '404 - Post not found' } )
                }

                let content = req.body.content ? req.body.content : post.content
                let attachment = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : post.attachment

                if(post.user_id !== user.id) {
                    return res.status(401).json({ error: '401 - You aren\'t authorized' })
                }
                
                post.update({
                    content: content,
                    attachment: attachment,
                    updatedAt: Date.now()
                })
                .then(() => res.status(200).json({ message: 'Post has been modified' }))
                .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))
            })
            .catch(error => res.status(500).json({ error: 'B - 500 - ' + error }))
    })
    .catch(error => res.status(500).json({ error: 'C - 500 - ' + error }))
}

// Suppression d'un post
exports.deletePost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({ where: { id : decodedToken.userId } })
        .then(user => {
            if(!user){
                return res.status(404).json({ error: '404 - User not found' })
            }
            models.Post.findOne({ where: { id: req.params.id } })
                .then(post => {
                    if(!post){
                        return res.status(404).json({ error : '404 - Post not found' })
                    }
                    if(user.id !== post.user_id) {
                        return res.status(401).json({ error : '401 - You aren\'t authorized' })
                    }

                    models.Comment.destroy({ where: { post_id : post.id } })
                        .then(() => {
                            let filename = post.attachment ? post.attachment.split('/images/')[1] : null
                            fs.unlink(`images/${filename}`, () => {
                            post.destroy()
                                .then(() => {
                                    res.status(200).json({ message: 'Post deleted with success' })
                                })
                                .catch(error => res.status(500).json({ error : 'B - 500 - ' + error }))
                                })
                        })
                        .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))
                })
                .catch(error => res.status(500).json({ error: 'C - 500 - ' + error }))
        })
        .catch(error => res.status(500).json({ error: 'D - 500 - ' + error }))
}

// Obtention de tous les posts
exports.getAllPosts = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({ where: { id : decodedToken.userId } })
        .then(user => {
            if(!user) {
                return res.status(404).json({ error: '404 - User not found' })
            }

            models.Post.count()
                .then(nbOfPosts => {
                    if (nbOfPosts < 1) {
                        return res.status(404).json({ error: '404 - No post found' })
                    }

                    models.Post.findAll({
                        include : [
                            {
                                model: models.User,
                                attributes: ['firstName', 'lastName', 'profilePicture'],
                                where: { id: {[Op.col] : 'Post.user_id'} }
                            },
                            {
                                model: models.Comment,
                                where: { post_id: {[Op.col] : 'Post.id'} },
                                include : {
                                    model: models.User,
                                    attributes: ['firstName', 'lastName', 'profilePicture']
                                },
                                required: false
                            }
                        ],
                        order: [
                            ['createdAt', 'ASC'],
                        ]
                    })
                        .then(posts =>  {
                            res.status(200).send(posts)
                        })
                        .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))

                })
                .catch(error => res.status(500).json({ error: 'B - 500 - ' + error }))

        })
        .catch(error => res.status(500).json({ error: 'B - 500 - ' + error }))
}

// Obtention de tous les posts d'un user
exports.getAllPostsFromUser = (req, res) => {
    models.User.findOne({ where: { id: req.params.id } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: '404 - User not found' })
            }
            models.Post.count({ where: { user_id: req.params.id } })
                .then(nbOfPosts => {
                    if (nbOfPosts < 1) {
                        return res.status(404).json({ error: '404 - No post found' })
                    }
                    models.Post.findAll({ where:
                        { user_id: req.params.id },
                        attributes: [ 'id', 'user_id', 'post_id' ],
                        include: [
                           {
                               model: models.User,
                               attributes: [ 'id', 'firstName', 'lastName', 'profilePicture' ],
                               where: { id: {[Op.col]: 'Post.user_id'} }
                           },
                           {
                                model: models.Comment,
                                attributes: [ 'id', 'content', 'user_id', 'post_id', 'createdAt', 'updatedAt' ],
                                where: { post_id: {[Op.col]: 'Post.id'} },
                                include : {
                                    model: models.User,
                                    attributes: [ 'firstName', 'lastName', 'profilePicture' ]
                                },
                                required: false
                           }
                        ],
                        order: [
                            [ 'createdAt', 'ASC' ]
                        ]
                    })
                        .then(likes => {
                            res.status(200).send(likes)
                        })
                        .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))
                })
                .catch(error => res.status(500).json({ error: 'B - 500 - ' + error }))
        })
        .catch(error => res.status(500).json({ error: 'C - 500 - ' + error }))
}

// Obtention d'un post
exports.getOnePost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({ where: { id : decodedToken.userId } })
        .then(user => {
            if(!user){
                return res.status(404).json({ error: '404 - User not found' })
            }
                models.Post.findOne({ where: 
                    { id: req.params.id },
                    include: [
                        {
                            model: models.User,
                            attributes: ['firstName', 'lastName', 'profilePicture'],
                            where: {
                                id: {[Op.col] : 'Post.user_id'}
                            }
                        },
                        {
                            model: models.Comment,
                            attributes: [ 'id', 'content', 'user_id', 'post_id', 'createdAt', 'updatedAt' ],
                            where: { post_id: {[Op.col]: 'Post.id'} },
                            include : {
                                model: models.User,
                                attributes: [ 'firstName', 'lastName', 'profilePicture' ]
                            },
                            required: false
                        }
                    ]
                })
            .then(post =>  {
                if(!post){
                    return res.status(404).json({ error: '404 - Post not found' })
                }
                res.status(200).send(post)
            })
        })
        .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))
}