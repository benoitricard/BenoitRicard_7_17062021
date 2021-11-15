const express = require('express')
const router = express.Router()

const commentCtrl = require('../controllers/comment')
const auth = require('../middlewares/auth')

router.post('/', auth, commentCtrl.createComment)
router.delete('/:id', auth, commentCtrl.deleteComment)
router.get('/', auth, commentCtrl.getAllComments)

module.exports = router