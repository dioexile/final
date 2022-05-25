const {Offer, User, Chat, Message} = require('../models/models')
const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const { Op } = require("sequelize");

class ChatController{
    async send(req, res, next){
        try {
            const {messageText, userId, offerId} = req.body
            const chatCandidate = await Chat.findOne({where: {recipients: [userId, offerId]}})
            
            if(!chatCandidate){
                const chat = await Chat.create({recipients: [userId, offerId]})
                const message = await Message.create({body: messageText, userId, chatId: chat.id})
                chat.content = [message.id]
                await chat.save() 
            }
            else{
                const chat = await Chat.findOne({where: {recipients: [userId, offerId]}})
                const message = await Message.create({body: messageText, userId, chatId: chat.id})
                await chat.update({content : [...chat.content, message.id]})
            }
            return res.json(chatCandidate)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getOne(req, res, next){// получает сообщения чата {where: {chatId: chat.id}}
        try {
            const {id} = req.params
            let chatCandidate = await Chat.findOne({where: { 
                id: id, 
              }})            
            return res.json(chatCandidate)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getOneId(req, res, next){// получает сообщения чата {where: {chatId: chat.id}}
        try {
            const {userId, offerId} = req.body
            const chatCandidate = await Chat.findOne({where: {  
                [Op.or]:[
                  {recipients: [userId, offerId]}, 
                  {recipients: [offerId, userId]}
                ]
              }})
            return res.json(chatCandidate)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getMes(req, res, next){// получает сообщения чата {where: {chatId: chat.id}}
        try {
            const {id} = req.params
            const chat = await Chat.findOne({where:{id: id}})
            const messages = await Message.findAll({where: {chatId: chat.id}})
            return res.json(messages)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async get(req, res) {//получает чаты и сообщения из них
        const chats = await Chat.findAll()
        return res.json(chats)
    }
}

module.exports = new ChatController()