const Router = require('express')
const router = new Router()
const rateController = require('../controllers/rateController')

router.post('/send', rateController.send)
router.get('/:id', rateController.getAll)
router.post('/getOne', rateController.getOne)

module.exports = router