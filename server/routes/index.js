const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const offerRouter = require('./offerRouter')
const purchaseOfferRouter = require('./purchaseOfferRouter')
const chatRouter = require('./chatRouter')
const rateRouter = require('./rateRouter')
const commentRouter = require('./commentRouter')

router.use('/user', userRouter)
router.use('/offer', offerRouter)
router.use('/purchase-offer', purchaseOfferRouter)
router.use('/chat', chatRouter)
router.use('/rate', rateRouter)
router.use('/comment', commentRouter)

module.exports = router