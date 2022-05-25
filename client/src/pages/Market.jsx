import React, { useState, useEffect } from 'react'
import OffersList from '../components/OffersList'
import '../css/market.css'
import { Link } from 'react-router-dom'
import '../css/controls.css'
import { fetchOffers } from '../http/offerApi';
import { fetchSellOffers } from '../http/SellOfferApi';
import axios from 'axios';

const Market = () => {
  const [loading, setLoading] = useState(true)

  const [offerList, setOfferList] = useState([])
  const [sellOfferList, setSellOfferList] = useState([])
  const [buyActive, setBuyActive] = useState(true)
  const [sellActive, setSellActive] = useState(false)
  const [value, setValue] = useState('')
  const sellStyles = ['sell-btn']
  const buyStyles = ['buy-btn']


  const all = []

  const pizda = async (offers) => {
    const gr = []
    const payload = await Promise.all(offers.map( async (offer) => {
      const user = await axios.get(' http://localhost:5000/api/user/' + offer.userId)
      gr.push({
        id: offer.id,
        project: offer.project,
        shortDescription: offer.shortDescription,
        price: offer.price,
        userId: offer.userId,
        username: user.data.username,
        img: user.data.img
      })
    }))
    setOfferList(gr.reverse())
  }

  useEffect(() => {
    setLoading(true)
    fetchOffers().then(data => {
      pizda(data)
    })

    fetchSellOffers().then(data => setSellOfferList(data.reverse()))
    setLoading(false)
  }, [])
  if(loading){
    return <div className="spinner"></div>
  }
  const filtredOffers = offerList.filter(offer => {
    return offer.project.toLowerCase().includes(value.toLowerCase())
  })

  const filtredSellOffers = sellOfferList.filter(offer => {
    return offer.project.toLowerCase().includes(value.toLowerCase())
  })

  if (buyActive){
    buyStyles.push('buy-active')
  }
  if(sellActive){
    sellStyles.push('sell-active')
  }
  const handleBuy = () => {
    setSellActive(false)
    setBuyActive(true)
  }

  const handleSell = () => {
    setSellActive(true)
    setBuyActive(false)
  }
  
  const sell = () => {
    if(buyActive){
      return (
        <Link to="create-offer">
          <button className='create-offer'>
            Create a sale offer
          </button>
        </Link>
      )
    } else {
      return(
        <Link to="sell-offer">
          <button className='create-offer'>
            Create a purchase offer
          </button>
        </Link>
      )
    }
  }
  


  return (
    <main className='main-page'>
      <div className="market-title">
        <h1 className='title'>Massive Crypto Trade: crypto community</h1>
        <p className="desc">A marketplace where people can share deals with each other directly and on their own terms from almost any country</p>
      </div>
      <div className="controls">
        <div className="market-controls">
          <div className="conrols-btns">
            <div className="market-button">
              <div className={buyStyles.join(' ')} onClick={handleBuy}>buy</div>
              <div className={sellStyles.join(' ')} onClick={handleSell}>sell</div>
            </div>
            <div className="controls-input">
              <input type="text" placeholder='Search' value={value} onChange={(e) => setValue(e.target.value)}/>
              <button >
                <img src="/img/search_icon.svg" alt="" className="search-icon"/>
              </button>
            </div>
          </div>
          <div className="controls-right">
            {sell()}
          </div>
        </div>
      </div> 
      <div className='container'>
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
        <OffersList 
          setOfferList={setOfferList}
          buyActive={buyActive} 
          offerList={offerList} 
          sellOfferList={sellOfferList} 
          filtredSellOffers={filtredSellOffers} 
          filtredOffers={filtredOffers}
        />
      </div>
    </main>
  )
}

export default Market