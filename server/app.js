require('dotenv').config();
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const fileUpload = require('express-fileupload')
const {Chat, Message, User} = require('./models/models')
const { Op } = require("sequelize");



const PORT = process.env.PORT || 5000


const app = express()
// app.use((res) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-Requested-With, content-type'
//   );
// });
app.use(express.json({ extended: true }))
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(fileUpload({}))
// app.use(cors())
app.use('/api', router)

// Обработка ошибок, последний Middleware
app.use(errorHandler)

const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
})

async function start(){
  try {

    await sequelize.authenticate()
    await sequelize.sync()
    httpServer.listen(PORT, () => console.log(`app started on PORT ${PORT}...`))

  } catch (error) {

    console.log(error.message)
    process.exit(1)

  }
}
const onConnection = async (socket) => {
  const {id} = socket.handshake.query;
  socket.join(id);

  socket.on("send", async (io) => {

    let chatCandidate = await Chat.findOne({where: {  
      [Op.or]:[
        {recipients: [io.userId, io.offerId]}, 
        {recipients: [io.offerId, io.userId]}
      ]
    }})

    if(!chatCandidate){
      const chat = await Chat.create({recipients: [io.userId, io.offerId]})
      const message = await Message.create({body: io.messageText, userId: io.userId, chatId: chat.id})
      chat.content = [message.id]
      chat.save()
      const messages = await Message.findAll({where: {chatId: chat.id}})
      socket.in(id).emit('messages', {messages})
    }
    else{
      const chat = await Chat.findOne({where: {  
        [Op.or]:[
          {recipients: [io.userId, io.offerId]}, 
          {recipients: [io.offerId, io.userId]}
        ]
      }})
      const message = await Message.create({body: io.messageText, userId: io.userId, chatId: chat.id})
      await chat.update({content : [...chat.content, message.id]})
      const messages = await Message.findAll({where: {chatId: chat.id}})
      socket.in(id).emit('messages', {messages})
    }
  })
  
  socket.on("offer", async (io) => {
    try{
      const chat = await Chat.findOne({where:{recipients: [io.userId, io.offerId]}})
      const messages = await Message.findAll({where: {chatId: chat.id}})
      socket.in(id).emit('messages', {messages})
    } catch{
      null
    }
  })

  socket.on("chats", async (io) => {
    const candidate = await Chat.findAll()
    socket.emit('allchats', candidate)
  })

  socket.on("offer", async (io) => {
    try{
      const chat = await Chat.findOne({where:{recipients: [io.userId, io.offerId]}})
      const messages = await Message.findAll({where: {chatId: chat.id}})
      socket.in(id).emit('messages', {messages})
    } catch{
      null
    }
  })
  // socket.on("disconnect", () => {
  //   console.log(`Client ${socket.id} diconnected`);
  //   socket.leave(id);
  // });
}

io.on("connection", onConnection)


start()