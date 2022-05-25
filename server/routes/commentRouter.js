const Router = require('express')
const router = new Router()
const commentsController = require('../controllers/commentController')

router.post('/send', commentsController.send)
router.get('/getAll/:id', commentsController.getAll)

module.exports = router