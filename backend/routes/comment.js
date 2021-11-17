const express = require('express')
const router = express.Router()

const commentCtrl = require('../controllers/comment')
const auth = require('../middlewares/auth')

router.post('/', auth, commentCtrl.createComment)
router.put('/:id', auth, commentCtrl.modifyComment)
router.delete('/:id', auth, commentCtrl.deleteComment)
router.get('/', auth, commentCtrl.getAllComments)
router.get('/:id', auth, commentCtrl.getOneComment)

module.exports = router