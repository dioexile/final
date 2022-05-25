import React, {useState} from 'react'
import axios from 'axios';
import { Rate } from 'antd';
import '../../css/buy-offer.css'
import { Input } from 'antd';
import jwt_decode from "jwt-decode";
import { message } from 'antd';

const FeedbackForm = ({user, setVisible}) => {
  const { TextArea } = Input;
  const [value, setValue] = useState(0)
  const [text, setText] = useState('')
  const addRate = async () => {
    try {
      const {data} = await axios.post(' http://localhost:5000/api/rate/send', {
      uId: jwt_decode(localStorage.getItem('token')).id, 
      rId: user.id, 
      rate: value
    })
    } catch (e) {
      message.error(e.response.data.message)
    }
  }
  const addComment = async () => {
    try {
      const {data} = await axios.post(' http://localhost:5000/api/comment/send', {
      uId: jwt_decode(localStorage.getItem('token')).id, 
      cId: user.id,
      body: text
    })
    } catch (e) {
    }
  }
  const confirm = (e) => {
    try {
      e.preventDefault()
      addRate()
      addComment()
      setVisible(false)
    } catch (e) {
    }
  }
  return (
    <div className='overlay'>
      <div className='buy-form'>
        <img src="/img/close.svg" alt="" className='close' onClick={ () => setVisible(false)}/>
        <h1 style={{"fontWeight": 600}}>Feedback</h1>
        <Rate onChange={setValue} value={value} className='ratingg'/>
        <form >
          <div className='buy-form__input'>
            <TextArea
              value={text}
              autoSize={{ minRows: 3, maxRows: 6 }} 
              style={{border: 'none'}}
              onChange={e => setText(e.target.value)} 
            />
          </div>
          <button className='buy-form__btn' onClick={confirm}>Send</button>
        </form>
      </div>
    </div>
  )
}

export default FeedbackForm