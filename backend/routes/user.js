const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/user')
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')

router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)
router.put('/:id', auth, multer, userCtrl.modifyUser)
router.delete('/:id', auth, userCtrl.deleteUser)
router.get('/:id', auth, userCtrl.getOneUser)
router.get('/', auth, userCtrl.getAllUsers)
router.get('/:id/post', auth, userCtrl.getAllPostsFromUser)
router.get('/:id/like', auth, userCtrl.getAllLikesFromUser)


module.exports = router