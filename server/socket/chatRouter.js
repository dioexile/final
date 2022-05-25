const Router = require('express')
const router = new Router()
const chatController = require('../controllers/chatController')




router.get('/send', (req, res) => {
    chatController.offer
})

// router.get('/chatMessages', chatController.chatMessages) 
// router.get('/getall', chatController.getAll)


module.exports = router
    