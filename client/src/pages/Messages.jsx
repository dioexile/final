import React, {useEffect, useState} from 'react';
import '../css/messages.css'
import jwt_decode from "jwt-decode";
import { fetchChats, fetchOneChatId } from '../http/chatApi';
import { fetchOneUser } from '../http/userApi';
import Chat from '../components/Chat';
import { Routes, useNavigate, Route, Link} from 'react-router-dom';
import axios from 'axios';

const Messages = () => {
  const [user, setUser] = useState([])
  const [chats, setChats] = useState([])
  const [chat, setChat] = useState({})
  const style = ['sidebar-list__item']
  const [you, setYou] = useState({})
  const id = jwt_decode(localStorage.getItem('token')).id
  const navigate = useNavigate()

  const xui = async (filtredChats) => {
    const payload = await Promise.all(filtredChats.map(async (chat) => {
      const xui2 = ()=> {
        if(id === chat.recipients[1]){
          return chat.recipients[0]
        } else {
          return chat.recipients[1]
        }
      }
      const {data} = await axios.get(' http://localhost:5000/api/user/' + xui2())
      return data
    }))
    setUser(payload)
  }

  useEffect(() => {
    fetchChats().then(data => {
      const filtredChats = data.filter(chat => {
        return chat.recipients.includes(id)
      })
      setChats(filtredChats)

      xui(filtredChats)
    })
  }, [])

  const click = async (user) => {
    setYou(user)
    const {data} = await axios.post(' http://localhost:5000/api/chat/getoneid' , {userId: id, offerId: user.id})
    navigate(`${data.id}`)
    setChat(data)
    style.push('.active-chat')
  }
  return (
    <div className='messages-page'>
      <div className="container">
        <div className="messages-box">
          <div className="messages-sidebar">
            <div className="sidebar-title">
              <h2>Messages</h2>
            </div>
            <ul className="sidebar-list" >
              {user.map((user) => (
                <li className={style.join(' ')} onClick={()=> click(user)} key={user.id}>
                  <img src={`${process.env.REACT_APP_API_URL + 'static/' + user.img}`} alt="" className='messages-img'/>
                  <h3>{user.username}</h3>
                </li>
              ))}
            </ul>
          </div>
          <Routes>
            <Route path="/:id" element={<Chat you={you}/>}/>
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Messages 