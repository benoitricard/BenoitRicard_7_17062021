const express = require('express')
const router = express.Router()

const likeCtrl = require('../controllers/like')
const auth = require('../middlewares/auth')

router.post('/:postid', auth, likeCtrl.likePost)
router.get('/:id', auth, likeCtrl.getOneLike)

module.exports = router