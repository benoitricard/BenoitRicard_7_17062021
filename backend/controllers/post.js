// Dépendances
const models = require('../models')
const fs = require('fs')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const secretToken = process.env.TOKEN

exports.createPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)
    
    models.User.findOne({ where : { id : decodedToken.userId } })
        .then(user => {
            if(!user){
                return res.status(404).json({ error : 'User not found' })
            }

            let content = req.body.content
            let attachment = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`: null

            models.Post.create({
                content: content,
                attachment: attachment,
                user_id: user.id
            })
            .then(() =>  res.status(201).json({ message: 'Post created with success' }))
            .catch(error => res.status(500).json({ error : 'A - 500 - ' + error }))
        })
        .catch(error => res.status(500).json({ error : 'B - 500 - ' + error }))
}

exports.modifyPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)

    User.findOne({ where : { id : decodedToken.userId } })
    .then(user => {
        if(!user){
            return res.status(404).json({ error: 'User not found' })
        }
        Post.findOne({ where : { id : req.params.id } })
            .then(post => {
                if(!post){
                    return res.status(404).json({ error: 'Post not found' } )
                }

                let content = req.body.content ? req.body.content : post.content
                let attachment = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : post.attachment

                if(post.userId !== User.id) {
                    return res.status(401).json({ error: 'You aren\'t authorized' })
                }
                
                post.update({
                    content : content,
                    attachment : attachment
                })
                .then(() => res.status(200).json({ message: 'Post has been modified' }))
                .catch(error => res.status(500).json({ error: 'An error occured (creation): ' + error }))
            })
            .catch(error => res.status(500).json({ error: 'An error occured (post): ' + error }))
    })
    .catch(error => res.status(500).json({ error : 'An error occured (authentification): ' + error }))
}

exports.likePost = (req, res, next) => {

}

exports.deletePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)

    User.findOne({ where: {id : decodedToken.userId} })
        .then(user => {
            if(!user){
                return res.status(404).json({ error : 'User not found' })
            }
            Post.findOne({ where : { id : req.params.id } })
                .then(post => {

                    if(!article){
                        return res.status(404).json({ error : 'Post not found' })
                    }

                    if(user.id !== post.userId) {
                        return res.status(401).json({ error : 'You aren\'t authorized' })
                    }

                    Comment.destroy({ where : { postId : post.id }})
                        .then(() => res.status(200).json({ message: 'Comments deleted with success' }))
                        .catch(error => res.status(500).json({ error: 'An error occured (comments): ' + error }))

                    let filename = post.attachment ? post.attachment.split('/images/')[1] : null
                    fs.unlink(`images/${filename}`, () => {
                        post.destroy()
                            .then(() => {
                                res.status(200).json({ message: 'Post deleted with success' })
                            })
                            .catch(error => res.status(500).json({ error : 'An error occured (deletion): ' + error }))
                    })

                })
                .catch(error => res.status(500).json({ error : 'An error occured (post): ' + error }))
        })
        .catch(error => res.status(500).json({ error : 'An error occured (authentification): ' + error }))
}

exports.getAllPosts = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)

    User.findOne({ where: {id : decodedToken.userId} })
        .then(user => {
            if(!user){
                return res.status(404).json({ error : 'User not found' })
            }
            Post.findAll({
                include : [
                    {
                        model: User,
                        attributes: ['firstName', 'lastName', 'profilePicture'],
                        where: { id: {[Op.col] : 'Post.userId'}}
                    },
                    {
                        model: Comment,
                        where: { postId: {[Op.col] : 'Post.id'} },
                        include : {
                            model: User,
                            attributes: ['firstName', 'lastName', 'profilePicture']
                        },
                        required: false
                    }
                ],
                order: [
                    ['id', 'ASC'],
                ],
            })
            .then(post =>  {
                if(!post){
                    return res.status(404).json({ error: 'Post not found' })
                }
                res.status(200).send({post})
            })
            .catch(error => res.status(400).json({ error: 'An error occured (post): ' + error }))

        })
        .catch(error => res.status(500).json({ error : 'An error occured (authentification): ' + error }))

}

exports.getOnePost = (req, res, next) => {
    Post.findOne({ where : 
        { id : req.params.id },
        include : [{
            model: User,
            attributes: ['firstName', 'lastName', 'profilePicture'],
            where: {
                id: {[Op.col] : 'Post.userId'}
            }
        },
        {
            model: Comment,
            where: {
                postId: {[Op.col] : 'Post.id'}
            },
            include : [{
                model: User,
                attributes: ['firstName', 'lastName', 'profilePicture'],
            }],
            required: false
        }]
    })
        .then(post =>  {
            if(!post){
                return res.status(404).json({ error: 'Post not found' })
            }
            res.status(200).send(post)})
        .catch(error => res.status(400).json({ error: 'An error occured (post): ' + error }))
}