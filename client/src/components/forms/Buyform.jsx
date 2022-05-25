import React, {useEffect, useState, useRef} from 'react';
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Buyform = ({user, setVisible, buyOffer}) => {
  const { TextArea } = Input;
  const [img, setImg] = useState('')
  let navigate = useNavigate();
  const socketRef = useRef();
  const [value, setValue] = useState('');
  const [you, setYou] = useState('');

  const handleUserProfile = () => {
    navigate(`/profile/${user.id}`)
  }
  const getYou = async () => {
    const {data} = await axios.get(' http://localhost:5000/api/user/' + jwt_decode(localStorage.getItem('token')).id)
    setYou(data)
  }
  useEffect(() => {
    socketRef.current = socketIOClient('ws://localhost:5000')
    setImg(`${process.env.REACT_APP_API_URL + 'static/' + user.img}`)
    getYou()
  }, [])


  const send = (e) => {
    e.preventDefault( )
    socketRef.current.emit('send', {
      messageText: `User ${you.username} wants to buy ${buyOffer.project}`,
      userId: jwt_decode(localStorage.getItem('token')).id,
      offerId: user.id,
    })
    setValue('')
  }

  return (
    <div className='overlay'>
      <div className='buy-form'>
        <img src="/img/close.svg" alt="" className='close' onClick={ () => setVisible(false)}/>
        <div className="chat-head">
          <img src={img} alt="" onClick={handleUserProfile}/>
          <div className="chat-user-info">
            <span className='chat-username' onClick={handleUserProfile}>{user.username}</span>
            <span className='chat-online'>isOnline</span>
          </div>
        </div>
        <form>
          <div className='buy-form__input'>
            <TextArea
              value={value}
              placeholder={`Write to ${user.username}`}
              autoSize={{ minRows: 6, maxRows: 10 }} 
              style={{border: 'none'}}
              onChange={e => setValue(e.target.value)} 
            />
          </div>
          <button className='buy-form__btn' onClick={send}>Send</button>
        </form>
      </div>
    </div>
  )
}

export default Buyform