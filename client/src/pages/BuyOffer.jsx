import React, { useEffect, useState } from 'react'
import '../css/buy-offer.css'
import {useParams} from 'react-router-dom'
import { fetchOneOffer, deleteOffer } from '../http/offerApi';
import { fetchOneUser } from '../http/userApi';
import Chat from '../components/Chat';
import Buyform from '../components/forms/Buyform';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import DeleteForm from '../components/forms/DeleteForm';
import axios from 'axios';
import { Rate } from 'antd';
import { message } from 'antd';


const BuyOffer = () => {
  const [xui, setXui] = useState([])
  const [buyOffer, setBuyOffer] = useState({})
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [deleteForm, setDeleteForm] = useState(false)
  const [owner, setOwner] = useState(false)
  const [img, setImg] = useState('')
  let navigate = useNavigate();
  const userId = jwt_decode(localStorage.getItem('token')).id
  const {id} = useParams()
  useEffect(() => {
      setTimeout(() => {
        setLoading(false)
      }, 100);

  }, [])

  const pizda = async (comments) => {
    const gr = []
    const payload = await Promise.all(comments.map( async (com) => {
      const {data} = await axios.get(' http://localhost:5000/api/user/' + com.userId)
      const offer = await axios.get(' http://localhost:5000/api/offer/' + id)
      const rating = await axios.post(' http://localhost:5000/api/rate/getOne' , {userId: data.id, ratedId: offer.data.userId})
      gr.push({
        id: data.id,
        username: data.username,
        comment: com.body,
        image: data.img,
        rate: rating.data.rate
      })
    }))
    setXui(gr)
  }

  useEffect(() => {
    fetchOneOffer(id).then(data => {
      const getComments = async () => {
        await axios.get(' http://localhost:5000/api/comment/getAll/' + data.userId).then(data => {
          pizda(data.data)
        })
      }
      getComments()
      setBuyOffer(data)
      if(userId === data.userId){
        setOwner(true)
      }
      fetchOneUser(data.userId).then(user => setUser(user))
      setImg(`${process.env.REACT_APP_API_URL + 'static/' + user.img}`)
    })
  }, [])

  if(loading){
    return <div className="spinner"></div>
  }
  
  const showModal = () => {
    if(visible){
      return <Buyform visible={visible} setVisible={setVisible} user={user} buyOffer={buyOffer}/>
    } else{
      return null
    }
  }

  const showDelete = () => {
    if(deleteForm){
      return <DeleteForm setDeleteForm={setDeleteForm} id={id}/>
    } else{
      return null
    }
  }
  const addTofav = async () => {
    try {
      await axios.post(' http://localhost:5000/api/offer/addfavorites', {userId: userId, offerId: buyOffer.id, id:userId})
      message.success(`The offer ${buyOffer.project} has been added to the favorites`)
    } catch (e) {
      message.error(e.response.data.message)
    }

  }
  const isOwner = () => {
    if(owner){
      return(
        <div className="offer-controls">
          <button className='edit' onClick={() => navigate(`../../edit/${buyOffer.id}`)}>Edit</button>
          <button className='delete' onClick={() => setDeleteForm(true)}>Delete</button>
        </div>
      )
    } else {
      return(
        <div className="about-btn">
          <button className="addBuy" type='submit' onClick={() => setVisible(true)}>Buy</button>
          <button className="addFav" onClick={addTofav}>Add to favorites</button>
        </div>
      )
    }
  }
  const renderComments = () => {
      return(
        xui.map(item => (
          <li key={item.comment} className="comment-item">
            <div className="comment-user" onClick={()=> navigate(`../profile/${item.id}`)}>
              <img src={`${process.env.REACT_APP_API_URL + 'static/' + item.image}`} alt="" />
              <div className="ixix">
                <h2 className='comment-user__name'>{item.username}</h2>
                <Rate disabled value={item.rate} />
              </div>
            </div>
            <p className='comment-text'>{item.comment}</p>
          </li>
        ))
      )
  }
  return (
    <div className="container">
      <div className="buy-offer">
        <div className="offer-about">
          <div className="about-title">
            <h1>Checkout</h1>
          </div>
          <div className="row">
            <div className="project">
              <h6>Project:</h6>
              <p>{buyOffer.project}</p>
            </div>
            <div className="about-price">
              <h6>Price:</h6>
              <p>{buyOffer.price}</p>
            </div>
          </div>
          <div className="about-description">
            <h6>Short description:</h6>
            <p>{buyOffer.shortDescription}</p>
          </div>
          <div className="about-description">
            <h6>Full Description:</h6>
            <p>{buyOffer.fullDescription}</p>
          </div>
          {isOwner()}
        </div>
        
        <div className="comments">
            <div className="about-title">
              <h1>
                Reviews
              </h1>
            </div>
            <ul className="comments-list asd">
              {renderComments()}
            </ul>
          </div>
      </div>
      {showDelete()}
      {showModal()}
    </div>
  )
}

export default BuyOffer