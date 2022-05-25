
const Router = require('express')
const router = new Router()
const chatController = require('../controllers/chatController')

router.get('/get', chatController.get)

router.post('/getone/:id', chatController.getOne)
router.post('/getoneid', chatController.getOneId)
router.post('/getmes/:id', chatController.getMes)

module.exports = router
