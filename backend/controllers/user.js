// Dépendances
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const models = require('../models')
require('dotenv').config()

const secretToken = process.env.TOKEN

// Regex
const textRegex = /^[A-Za-z]{2,}$/
const emailRegex = /^[A-Za-z0-9_.+-]+\@[A-Za-z0-9_.+-]+\.[A-Za-z]+$/
const passwordRegex = /[\w]{8,24}/

exports.signup = (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const password = req.body.password

    if(!textRegex.test(firstName)){
        return res.status(400).json({ error : '400 - First name must contains only letters: ' + '(' + firstName + ')'})
    }
    if(!textRegex.test(lastName)){
        return res.status(400).json({ error : '400 - Last name must contains only letters: ' + '(' + lastName + ')'})
    }
    if(!emailRegex.test(email)){
        return res.status(400).json({ error : '400 - The syntax is incorrect: ' + '(' + email + ')'})
    }
    if(!passwordRegex.test(password)){
        return res.status(400).json({ error : '400 - Password must contains between 8 and 24 characters: ' + '(' + password + ')'})
    }

    models.User.findOne({ where: { email : email } })
        .then(user => {
            if(user) {
                return res.status(401).json({ error : '401 - Email address already exists ' + '(' + email + ')'})
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
                                {userId : user.id},
                                secretToken,
                                { expiresIn: '24h'}
                            )
                        })
                    }
                })
                .catch(err => res.status(500).json({ error : 'A - 500 - ' + err }))
            }
        })
        .catch(err => res.status(500).json({ error : 'B - 500 - ' + err }))
}

exports.getProfile = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findOne({
        attributes: [ 'email', 'lastName', 'firstName' ],
        where: { id : user.id }
    })
    .then(user => {
        if(!user){
            return res.status(404).json({ error : 'User not found' })
        }
        res.status(200).send(user)
    })
    .catch(err => res.status(500).json({ error : 'An error occured (user not found): ' + err }))
}

exports.getAllUsers = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretToken)

    models.User.findAll()
    .then(user =>  {
        if(!user){
            return res.status(404).json({ error: 'User not found' })
        }
        res.status(200).send({user})
    })
    .catch(error => res.status(400).json({ error: 'An error occured (user): ' + error }))
}