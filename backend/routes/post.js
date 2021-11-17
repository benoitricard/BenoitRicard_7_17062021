const express = require('express')
const router = express.Router()

const postCtrl = require('../controllers/post')
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')

router.post('/', auth, multer, postCtrl.createPost)
router.put('/:id', auth, multer, postCtrl.modifyPost)
router.post('/:id/like', auth, postCtrl.likePost)
router.delete('/:id', auth, postCtrl.deletePost)
router.get('/', auth, postCtrl.getAllPosts)
router.get('/:id', auth, postCtrl.getOnePost)

module.exports = router