// Dépendances
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const models = require('../models')
const { Op } = require('sequelize')
require('dotenv').config()

const secretToken = process.env.TOKEN

// Regex
const textRegex = /^[A-Za-z]{2,}$/
const emailRegex = /^[A-Za-z0-9_.+-]+\@[A-Za-z0-9_.+-]+\.[A-Za-z]+$/
const passwordRegex = /[\w]{8,24}/

// Inscription
exports.signup = (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const password = req.body.password

    if(!textRegex.test(firstName)){
        return res.status(400).json({ error: '400 - First name must contains only letters: ' + '(' + firstName + ')'})
    }
    if(!textRegex.test(lastName)){
        return res.status(400).json({ error: '400 - Last name must contains only letters: ' + '(' + lastName + ')'})
    }
    if(!emailRegex.test(email)){
        return res.status(400).json({ error: '400 - The syntax is incorrect: ' + '(' + email + ')'})
    }
    if(!passwordRegex.test(password)){
        return res.status(400).json({ error: '400 - Password must contains between 8 and 24 characters: ' + '(' + password + ')'})
    }

    models.User.findOne({ where: { email : email } })
        .then(user => {
            if(user) {
                return res.status(401).json({ error: '401 - Email address already exists ' + '(' + email + ')'})
            } else {
                bcrypt.hash(password, 10)
                .then(hash => {
                    models.User.create({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: hash
                    })
                    .then(() => res.status(201).json({ message: 'User created with success' }))
                    .catch(err => res.status(400).json({ error: 'A - 400 - ' + err }))
                })
                .catch(err => res.status(500).json({ error: 'B - 500 - ' + err}))
            }
        })
        .catch(err => res.status(500).json({ error: 'C - 500 - ' + err }))
}

// Login
exports.login = (req, res) => {
    const email = req.body.email
    const password = req.body.password

    models.User.findOne({ where: { email : email } })
        .then(user => {
            if(!user){
                return res.status(404).json({ error: '404 - User not found' })
            } else {
                bcrypt.compare(password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: '401 - Incorrect password' })
                    } else {
                        return res.status(201).json({
                            userId: user.id,
                            token: jwt.sign(
                                {userId: user.id},
                                secretToken,
                                { expiresIn: '24h'}
                            )
                        })
                    }
                })
                .catch(err => res.status(500).json({ error: 'A - 500 - ' + err }))
            }
        })
        .catch(err => res.status(500).json({ error: 'B - 500 - ' + err }))
}

// Obtention d'un user
exports.getOneUser = (req, res) => {
    models.User.findOne({
        attributes: [ 'id', 'firstName', 'lastName', 'profilePicture', 'biography', 'jobTitle', 'birthday' ],
        where: { id : req.params.id }
    })
    .then(user => {
        if(!user){
            return res.status(404).json({ error: '404 - User not found' })
        }
        res.status(200).send(user)
    })
    .catch(err => res.status(500).json({ error: 'A - 500 - ' + err }))
}

// Obtention de tous les users
exports.getAllUsers = (req, res) => {
    models.User.findAll({
        attributes: [ 'id', 'firstName', 'lastName', 'profilePicture', 'biography', 'jobTitle', 'birthday' ],
        order: [
           ['createdAt', 'ASC']
        ]
    })
    .then(users =>  {
        if(!users){
            return res.status(404).json({ error: '404 - No user found' })
        }
        res.status(200).send(users)
    })
    .catch(error => res.status(400).json({ error: 'A - 500 - ' + error }))
}

// Modification d'un user
exports.modifyUser = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({ where: { id : decodedToken.userId } })
        .then(user => {
            if(!user){
                return res.status(404).json({ error: '404 - User not found' })
            }
            models.User.findOne({ where: { id : req.params.id } })
                .then(user => {
                    if (!user) {
                        return res.status(404).json({ error: '404 - User not found' })
                    }

                    let firstName = req.body.firstName ? req.body.firstName : user.firstName
                    let lastName = req.body.lastName ? req.body.lastName : user.lastName
                    let profilePicture = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : user.profilePicture
                    let jobTitle = req.body.jobTitle ? req.body.jobTitle : user.jobTitle
                    let biography = req.body.biography ? req.body.biography : user.biography
                    let birthday = req.body.birthday ? req.body.birthday : user.birthday

                    if(user.id !== decodedToken.userId) {
                        return res.status(401).json({ error: '401 - You aren\'t authorized' })
                    }

                    user.update({
                        firstName: firstName,
                        lastName: lastName,
                        profilePicture: profilePicture,
                        jobTitle: jobTitle,
                        biography: biography,
                        birthday: birthday,
                        updatedAt: Date.now()
                    })
                    .then(() => res.status(200).json({ message: 'User has been modified' }))
                    .catch(error => res.status(500).json({ error: 'A - 500 - ' + error }))
                })
                .catch(error => res.status(500).json({ error: 'B - 500 - ' + error }))
        })
        .catch(error => res.status(500).json({ error: 'C - 500 - ' + error }))
}

// Suppression d'un user
exports.deleteUser = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({ where: { id : decodedToken.userId } })
        .then(user => {
            if(!user){
                return res.status(404).json({ error: '404 - User not found' })
            }
            models.User.findOne({ where: { id : req.params.id } })
                .then(user => {
                    if (!user) {
                        return res.status(404).json({ error: '404 - User not found' })
                    }
                    if(user.id !== decodedToken.userId) {
                        return res.status(401).json({ error: '401 - You aren\'t authorized' })
                    }

                    models.Post.findAll({ where: { user_id : user.id } })
                        .then(posts => {

                            posts.forEach(post => {

                                models.Comment.destroy({ where: {
                                    [Op.or]: [
                                        { post_id: post.id },
                                        { user_id: user.id }
                                    ]
                                }
                                })
                                .then(() => res.status(200).json({ message: 'Comment(s) deleted with success' }))
                                .catch(error => res.status(500).json({ error: 'A - 500 - ' + error}))

                            })

                            models.Post.destroy({ where: { user_id : user.id } })
                                .then(() => res.status(200).json({ message: 'Post(s) deleted with success' }))
                                .catch(error => res.status(500).json({ error: 'B - 500 - ' + error }))

                        })
                        .catch(error => res.status(500).json({ error: 'C - 500 - ' + error }))

                    let filename = user.profilePicture ? user.profilePicture.split('/images/')[1] : null
                    fs.unlink(`images/${filename}`, () => {
            
                    user.destroy({ where: { user_id : user.id } })
                        .then(() => res.status(200).json({ message: 'User deleted with success' }))
                        .catch(error => res.status(500).json({ error: 'D - 500 - ' + error }))
                    })
                
                })
        })
        .catch(error => res.status(500).json({ error: 'E - 500 - ' + error }))
}