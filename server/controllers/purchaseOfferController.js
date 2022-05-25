const {PurchaseOffer, User} = require('../models/models')
const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')

class purchaseOfferController{
  async createsell(req, res, next){
      try {
          const token = req.headers.authorization.split(' ')[1]
          
          const decoded = jwt.verify(token, process.env.SECRET_KEY)
          const id = req.user = decoded.id
          const user = await User.findOne({where: {id}})

          const {project, wallet, price, shortDescription, fullDescription} = req.body
          const offer = await PurchaseOffer.create({project, wallet, price, shortDescription, fullDescription, userId: user.id})
          return res.json(offer)
      } catch (e) {
          next(ApiError.badRequest(e.message))
      }
  }

  async getAllsell(req, res, next){
      let {limit, page} = req.query
      page = page || 1
      limit = limit || 10
      try {
          const offers = await PurchaseOffer.findAll({limit})
          return res.json(offers)
      } catch (e) {
          next(ApiError.badRequest(e.message))
      }
  }
  async getOnesell(req, res) {
      const {id} = req.params
      const offer = await PurchaseOffer.findOne(
          {
              where: {id}
          },
      )
      return res.json(offer)
  }
  async delete(req, res) {
    const {id} = req.params
    const offer = await PurchaseOffer.destroy(
        {
            where: {id}
        },
    )
    return res.json(offer)
}
}

module.exports = new purchaseOfferController()