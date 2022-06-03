import React, { useEffect, useState, useCallback } from 'react'
import '../css/profile.css'
import {fetchOneUser } from '../http/userApi';
import {useParams} from 'react-router-dom'
import { fetchOffers } from '../http/offerApi';
import {uploadAvatar} from "../http/userApi";
import jwt_decode from "jwt-decode";
import { Rate } from 'antd';
import axios from 'axios';
import FeedbackForm from '../components/forms/FeedbackForm';
import {useNavigate, Link} from 'react-router-dom';

const Profile = () => {

  const [user, setUser] = useState({})
  const [regData, setRegDate] = useState('')
  let [offerList, setOfferList] = useState([])
  const [file, setFile] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const {id} = useParams()
  const [active, setActive] = useState(true)
  const [img, setImg] = useState('')
  const [rating, setRating] = useState()
  const [len, setLen] = useState()
  const [visible, setVisible] = useState()
  const [comments, setComments] = useState(false)
  const [offers, setOffers] = useState(false)
  const [xui, setXui] = useState([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const [value, setValue] = useState(user.username)



  const setVis = () => {
    if(edit){
      return 'n'
    } else{
      return 'upload-vis'
    }
  }

  const isOwner = () => {
    if (user.id === jwt_decode(localStorage.getItem('token')).id){
      return(
        <form className={setVis()}>
          <input type="file" name='img' accept='image/*' className='uploadFile' id="input__file" onChange={selectFile}/>
          <label htmlFor="input__file" className='uploadFile-button'>Upload image</label>
          <button onClick={sendFile} className="fileSubmit" disabled={active}>Submit</button>
        </form>
      )
    } else{
      return (
        <div className="profile-feedback">
          <button onClick={()=>setVisible(true)}>Give feedback</button>
        </div>
      )
    }
  }
  const editProfile = () => {
    setEdit(!edit)
  }
  const isOwnerBtn = () => {
    if (user.id === jwt_decode(localStorage.getItem('token')).id){
      return(
        <div className="account-row__button">
          <button onClick={editProfile} className="edit-profile">Edit</button>
          <button onClick={logOut}>Logout</button>
        </div>
      )
    } else{
      return (
        null
      )
    }
  }
  function average(arr){
    if(arr.length === 0)
        return 0;
 
    let sum = 0;
 
    for(let i = 0; i < arr.length; i++) {
        sum += arr[i];
    } 
    return sum / arr.length;
  }

  const sendFile = useCallback( (e) => {
    axios.post('http://localhost:5000/api/user/edit', {id: id, name: value})
    e.preventDefault()
    const formData = new FormData()
    formData.append('img', file)
    uploadAvatar(user.id, formData).then(res => setAvatar(res.formData))
  }, [file, user.id])

  const editName = async () => {
    await axios.post('http://localhost:5000/api/user/edit', {id: id, name: value})
  }
  const showForm = () => {
    if(visible){
      return(
        <FeedbackForm user={user} len={len} setVisible={setVisible}/>
      )
    } else{
      return null
    }
  }

  const all = []
  const pizda = async (comments) => {
    const gr = []
    const payload = await Promise.all(comments.map( async (com) => {
      const {data} = await axios.get(' http://localhost:5000/api/user/' + com.userId)
      const rating = await axios.post(' http://localhost:5000/api/rate/getOne' , {userId: com.userId, ratedId: user.id})
      gr.push({
        commentId: com.id,
        id: data.id,
        username: data.username,
        comment: com.body,
        image: data.img,
        rate: rating.data.rate
      })
    }))
    
    setXui(gr.reverse())
  }


  useEffect(() => {
    setLoading(true)

    fetchOneUser(id).then(data => {
      setUser(data)
      setValue(data.username)
      setImg(`${process.env.REACT_APP_API_URL + 'static/' + data.img}`)
      setRegDate(data.createdAt)
      const getRating = async () => {
        await axios.get(' http://localhost:5000/api/rate/' + data.id).then(data => {
          data.data.forEach(rate=>{
            all.push(rate.rate)
          })
          setLen(all.length)
          setRating(Math.round(average(all)))
        })
      }
      const getComments = async () => {
        await axios.get(' http://localhost:5000/api/comment/getAll/' + data.id).then(data => {
          pizda(data.data)
        })
      }
      getComments()
      getRating()
    })
    setLoading(false)

  }, [avatar, rating, id])

  if(loading){
    return <div className="spinner"></div>
  }

  const editUsername = () => {
    if(edit){
      return(
        <div className='editName'>
          <input type="text" value={value} onChange={(e)=>setValue(e.target.value)}/>
          <img src="/img/conf.png" alt="confirm" onClick={editName}/>
        </div>
      ) 
    } else{
      return(
        <span className='username'>{user.username}</span>
      )
    }
  }
  const offerFilter = (offer) => {
    return offer.userId === user.id
  }
  const selectFile = (e) => {
    setFile(e.target.files[0])
    setActive(false)
  }



  const showOffers = () => {
    setOffers(!offers)
    fetchOffers().then(data => {
      const xuis = async () => {
        const fg = []
        const payload2 = await Promise.all(data.map( async (offer) => {
          const user = await axios.get(' http://localhost:5000/api/user/' + offer.userId)
          fg.push({
            id: offer.id,
            project: offer.project,
            shortDescription: offer.shortDescription,
            price: offer.price,
            userId: offer.userId,
            username: user.data.username,
            img: user.data.img
          })
        }))
        setOfferList(fg)
      }
      xuis()
    })
  }

  const renderOffers = () => {
    offerList = offerList.filter(offerFilter)
    if(offers){
      return (
        <div className='vis'>
          <div className="columns">
            <ul className='columns-list'>
              <li className='columns-nick'>
                User
              </li>
              <li className='columns-rating'>
                Project
              </li>
              <li className='columns-description'>
                Description
              </li>
              <li className='columns-price'>
                Price
              </li>
            </ul>
          </div>
          <ul className='profile-offers__list'>
            {offerList.map(offer => 
              <li className="market-list__item" key={offer.id}>
                <div className="offer-user" onClick={()=>{navigate(`/profile/${offer.userId}`)}}>
                  <img src={`${process.env.REACT_APP_API_URL + 'static/' + offer.img}`} className='offer-img' alt="" />
                  <p className='offer-project'>{offer.username}</p>
                </div>
                <p className='offer-rating'>{offer.project}</p>
                <p className='offer-description'>{offer.shortDescription}</p>
                <p className='offer-price'>{offer.price}</p>
                <Link to={`/offer/${offer.id}`} >
                  <p className='offer-button_btn'>Buy</p>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )
    } else {
      return null
    }
  }
  const renderComments = () => {
    if(comments){
      return(
        xui.map(item => (
          <li key={item.commentId} className="comment-item">
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
    }else{
      return null
    }
  }
  const logOut = () => {
    localStorage.removeItem('token')
    navigate('../../')
  }
  const isAdmin = () => {
    if(user.role === 'ADMIN'){
      return <span className='role'>{`Role: ${user.role}`}</span>
    } else{
      return <span className='defrole'>{`Role: ${user.role}`}</span>

    }
  }
  return (
    
    <div className="container ww">
      {isOwnerBtn()}
      <div className="profile">
        <div className="profile-info">
          <div className="user">
            <a href={`${process.env.REACT_APP_API_URL + 'static/' + user.img}`}>
              <div className="profile-img">
                <img src={img} alt=""/>
              </div>
            </a>
            <div className="profile-name">
              {editUsername()}
              {isAdmin()}
              <div className="upload-wrapper">
              {isOwner()}
              </div>
            </div>
          </div>
          <div className="reg-info email">
            <h3>Email:</h3>
            <p>{user.email}</p>
          </div>
          <div className="reg-info">
            <h3>Registration date:</h3>
            <p>{regData.substring(0, 10)}</p>
          </div>
          <div className="reg-info">
            <h3>Rating:</h3>
            <div className="rating">
              <div className="wqer">
                <Rate disabled value={rating} />
                <span className='count'>{`(${len})`}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-offers">
          <div className="profile-offers__title">
            <button onClick={showOffers} >{`Show ${user.username}'s offers`} </button>
          </div>
          {renderOffers()}
        </div>
        <div className="profile-offers">
          <div className="profile-offers__title">
            <button onClick={() => {setComments(!comments)}}>{`Show reviews`}</button>
          </div>
          <ul className='comments'>
            {renderComments()}
          </ul>
        </div>
      </div>
      {showForm()}
    </div>
  )
}

export default Profile
