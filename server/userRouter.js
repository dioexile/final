const Router = require('express')
const { check } = require('express-validator')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', 
userController.registration,
[
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длинна пароля 6 символов')
    .isLength({min: 6}), 
    check('username', 'Максимальная длина 8 символов!')
    .isLength({max: 8})
])
router.post('/signIn', 
userController.signIn,
[
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
]
)

router.get('/auth', authMiddleware, userController.check)
router.get('/:id', userController.getUser)
router.get('/getUser', userController.getUserId)
router.post('/edit', userController.editName)

router.post('/chat', userController.chatMember)

router.post('/avatar/:id', userController.uploadAvatar)
router.delete('/avatar/:id', userController.deleteAvatar)

module.exports = router