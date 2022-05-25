const {Rating, Offer, User} = require('../models/models')
const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')


class rateController{
    async send(req, res, next){
        const {uId, rId, rate} = req.body
        const candidate = await Rating.findOne({where: {ratedId: rId, userId: uId}})
        console.log(candidate)
        if(candidate){
            return next(ApiError.internal('You have already left a review'))
        }
        const rating = await Rating.create({ratedId: rId, userId: uId, rate: rate})
        return res.json(rating)
    }

    async getAll(req, res, next){
        const {id} = req.params
        try {
            const user = await User.findOne({where: {id: id}})
            const rate = await Rating.findAll({where: {ratedId: user.id}})
            return res.json(rate)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getOne(req, res, next) {
        const {userId, ratedId} = req.body
        try {
            // const user = await User.findOne({where: {id: uId}})
            const rate = await Rating.findOne({where: {ratedId: ratedId, userId: userId}})
            return res.json(rate)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

}
module.exports = new rateController()
