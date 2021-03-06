// Dépendances
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

// Routes
const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const commentRoutes = require('./routes/comment')
const likeRoutes = require('./routes/like')

const app = express()

// Authorization
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.use(bodyParser.json())

// Routes de base
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/like', likeRoutes)
  
module.exports = app