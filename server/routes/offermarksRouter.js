const Router = require('express')
const router = new Router()

router.post('/create', offerController.create)
router.post('/get', offerController.getAll)
router.get('/:id', offerController.getOne)

module.exports = router