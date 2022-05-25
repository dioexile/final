import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {

  const [offers, setOffers] = useState([])
  const id = jwt_decode(localStorage.getItem('token')).id
  const navigate = useNavigate()

  const pizda = async (offers) => {
    const gr = []
    const payload = await Promise.all(offers.map( async (offer) => {
      const {data} = await axios.get(' http://localhost:5000/api/offer/' + offer)
      gr.push({
        id:data.id,
        project: data.project,
        price:data.price,
        shortDescription: data.shortDescription,
        userId: data.userId
      })
    }))
    const fg = []
    const payload2 = await Promise.all(gr.map( async (offer) => {
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
    setOffers(fg)
  }

  useEffect(() => {
    const fetch = async () => {
      const {data} = await axios.get('http://localhost:5000/api/offer/getfavorites/' + id)
      pizda(data[0].offers)
    }
    fetch()
  }, [])

  const renderOffers = () => {
    if(offers){
      return (
        <div className='vis'>
          <div className="columns">
            <ul className='columns-list'>
              <li className='columns-nick'>
                Project
              </li>
              <li className='columns-rating'>
                Rating
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
            {offers.map(offer => 
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
  return (
    <div className="container">
      <h1 className='fav-title'>Favorites</h1>
      {renderOffers()}
    </div>
  )
}

export default Favorites