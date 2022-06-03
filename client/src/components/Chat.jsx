import React, {useEffect, useState, useRef} from 'react';
import jwt_decode from "jwt-decode";
import {Link, useParams} from 'react-router-dom'
import socketIOClient from "socket.io-client";
import { fetchMessages, fetchOneChat } from '../http/chatApi';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import DealForm from './forms/DealForm';


const Chat = ({you}) => {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false)
  const [sender, setSender] = useState()
  const [recipient, setRecipient] = useState()
  const [messages, setMessages] = useState([])
  const {id} = useParams()
  const socketRef = useRef();
  const navigate = useNavigate()

  const userId = jwt_decode(localStorage.getItem('token')).id
  socketRef.current = socketIOClient('ws://localhost:5000', {
    query: { id },
  });
  useEffect(() => {
    fetchOneChat(id).then(data => {

      data.recipients.forEach(async (user) => {

        if(user === userId){
          const {data} = await axios.post('http://localhost:5000/api/user/chat', {id: user})
          setSender(data)
          
        } else{
          const {data} = await axios.post('http://localhost:5000/api/user/chat', {id: user})
          setRecipient(data)
        }
      })

    })
    socketRef.current.on('messages', (data) => {
      setMessages(data.messages)
    })
    fetchMessages(id).then(data => {
      setMessages(data)
    })


  }, [id])




  const send = (value) => {
    socketRef.current.emit('send', {
      userId: jwt_decode(localStorage.getItem('token')).id,
      offerId: recipient.id,
      messageText: value,
    })
    setValue('')
  }

  const get = (mes) => {
    if(mes.userId === userId){
      return(
        <div className="sender-mes" key={mes.id}>
          <div className="white"></div>
          <div className="sender" >
            <p>{mes.body}</p>
          </div>
        </div>
      )
    } else{
      return(
        <div className="recipient" key={mes.id}>
          <p>{mes.body}</p>
        </div>
      )
    }
  }
  const ShowDeal = () => {
    if(visible){
      return <DealForm setVisible={setVisible} you={you}/>
    } else{
      return null
    }
  }
  const addMsgHandler = (e) => {
    if(e.key=== 'Enter'){
      socketRef.current.emit('send', {
        userId: jwt_decode(localStorage.getItem('token')).id,
        offerId: recipient.id,
        messageText: value,
      })
      setValue('')
    }
  }
  return (
    <div className="messages-main">
      <div className="about-chat__user" >
        <div className="left" onClick={()=> navigate(`../../profile/${you.id}`)}>
          <img src={`${process.env.REACT_APP_API_URL + 'static/' + you.img}`} alt="" />
          <h3>{you.username}</h3>
        </div>
        <div className="right" onClick={()=>setVisible(true)}>
          <img src="/img/hands.png" className='handshake' onClick={()=> console.log(you) }/>
        </div>
      </div>
      
      <div className="conversation">
        {messages.map((mes)=>(
          get(mes)
        ))}
      </div>
      <div className="messages-input">
        <input
          className='chat-input'
          value={value}
          placeholder={`Write to ${you.username}`}
          onChange={e => setValue(e.target.value)}
          onKeyPress={addMsgHandler}
        />
        <img 
          src="/img/send.svg"
          onClick={()=>send(value)}
        />
      </div>
      {ShowDeal()}
    </div>
  )
}

export default Chat