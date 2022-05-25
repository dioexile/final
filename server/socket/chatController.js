const {Chat, Message} = require('../models/models')


module.exports = () => {
  const offer = async(io) => {
    const chat = await Chat.findOne({where:{recipients: [io.userId, io.offerId]}})
    const messages = await Message.findAll({where: {chatId: chat.id}, attributes: ['body', 'chatId']})
    io.emit('messages', {data: messages})
    console.log('first')
  }


  const send = async(io) => {
    let chatCandidate = await Chat.findOne({where: {recipients: [io.userId, io.offerId]}})
    if(!chatCandidate){
      const chat = await Chat.create({recipients: [io.userId, io.offerId]})
      const message = await Message.create({body: io.messageText, userId: io.userId, chatId: chat.id})
      chat.content = [...chat.content, message.id]
      chat.save()
    }
    else{
      const chat = await Chat.findOne({where: {recipients: [io.userId, io.offerId]}})
      const message = await Message.create({body: io.messageText, userId: io.userId, chatId: chat.id})
      await chat.update({content : [...chat.content, message.id]})
    }
    // chatCandidate = await Chat.findOne({where: {recipients: [io.userId, io.offerId]}})
  }
  const chat = async(io) => {
    const chat = await Chat.findAll({where:{recipients: io.userId}})
    const messages = await Message.findAll({where: {chatId: chat.id}, attributes: ['body', 'chatId']})
  
    messages.forEach(function(entry) {
      io.emit("chat", chat)
      io.emit("messages", messages)
    })
  }

  return {
    // showoffer,
    offer,
    send
  }
}

