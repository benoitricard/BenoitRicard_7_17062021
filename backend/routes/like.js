const express = require('express')
const router = express.Router()

const likeCtrl = require('../controllers/like')
const auth = require('../middlewares/auth')

router.post('/', auth, likeCtrl.likePost)
router.get('/', auth, commentCtrl.getAllLikes)
router.get('/:id', auth, commentCtrl.getOneLike)

module.exports = router