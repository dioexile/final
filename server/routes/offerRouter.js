const Router = require('express')
const router = new Router()
const offerController = require('../controllers/offerController')

router.post('/create', offerController.create)
router.post('/get', offerController.getAll)
router.get('/:id', offerController.getOne)
router.post('/edit', offerController.update)
router.delete('/:id', offerController.delete)
router.post('/addfavorites/', offerController.addFav)
router.get('/getfavorites/:id', offerController.getFav)

module.exports = router