const {Offer, User, OfferMarks} = require('../models/models')
const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')


class OfferController{
    async create(req, res, next){
        try {
            const token = req.headers.authorization.split(' ')[1]
            
            const decoded = jwt.verify(token, process.env.SECRET_KEY)// заменить на req.body, получать с клиента
            const id = req.user = decoded.id 
            const user = await User.findOne({where: {id}})

            const {project, wallet, price, shortDescription, fullDescription} = req.body
            const offer = await Offer.create({project, wallet, price, shortDescription, fullDescription, userId: user.id})
            return res.json(offer)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next){
        try {
            const offers = await Offer.findAll()
            return res.json(offers)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
        console.log("я ебу")
    }
    async getOne(req, res) {
        const {id} = req.params
        const offer = await Offer.findOne(
            {
                where: {id}
            },
        )
        return res.json(offer)
    }
    async update(req, res) {
        const {id, project, wallet, price, shortDescription, fullDescription} = req.body
        const offer = await Offer.findOne({where:{id: id}})
        offer.update({project, wallet, price, shortDescription, fullDescription})
        res.json(offer)
    }

    async delete(req, res) {
        const {id} = req.params
        const offer = await Offer.destroy(
            {
                where: {id}
            },
        )
        return res.json(offer)
    }
    async addFav(req, res) {
        const {userId, offerId} = req.body
        console.log(userId)

        console.log(offerId)
        let candidate = await OfferMarks.findOne({where:{userId: userId}})
        if(!candidate){
            await OfferMarks.create({userId, offers: [offerId]})
        } else {
            await candidate.update({offers: [...candidate.offers, offerId]})
            return res.json(candidate) 
        }
    }
    async getFav(req, res) {
        const {id} = req.params
        const marks = await OfferMarks.findAll({where: {userId: id}})
        return res.json(marks)
    }
}

module.exports = new OfferController()