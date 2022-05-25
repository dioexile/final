const { Comments, User} = require('../models/models')
const ApiError = require('../error/ApiError')

class commentsController{

    async send(req, res, next){
        const {uId, cId, body} = req.body
        const candidate = await Comments.findOne({where: {userId: uId, commentedId: cId}})
        if(candidate){
            return next(ApiError.internal('You have already left a review'))
        }
        const comment = await Comments.create({userId: uId, commentedId: cId, body: body})
        return res.json(comment)
    }

    async getAll(req, res, next){
        const {id} = req.params
        try {
            const user = await User.findOne({where: {id: id}})
            const comment = await Comments.findAll({where: {commentedId: user.id}})
            return res.json(comment)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    
}
module.exports = new commentsController()