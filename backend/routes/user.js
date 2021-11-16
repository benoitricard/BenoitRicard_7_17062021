const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/user')
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')

router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)
router.get('/:id', auth, userCtrl.getOneUser)
router.get('/', auth, userCtrl.getAllUsers)
router.put('/:id', auth, multer, userCtrl.modifyUser)
router.delete('/:id', auth, userCtrl.deleteUser)


module.exports = router