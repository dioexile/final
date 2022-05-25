import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Pagination from './Pagination'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OffersList = ({buyActive, filtredOffers, filtredSellOffers, offerList, setOfferList}) => {
  const [active, setActive] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage] = useState(10)
  const [xui, setXui] = useState()
  const lastIndex = currentPage * perPage
  const firstIndex = lastIndex - perPage
  const currentOffer = filtredOffers.slice(firstIndex, lastIndex)
  const navigate = useNavigate()

  const paginate = (pageNum) => {
    setCurrentPage(pageNum)
  }


  const offerUser = () => {
    navigate('../')
  }
  const whichList = () => {
    if(buyActive){
      if(currentOffer.length !== 0){
        return( 
          <ul className='market-list'>
            {currentOffer.map(offer => 
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
            <Pagination total={filtredOffers.length} perPage={perPage} paginate={paginate}/>
          </ul>
        )
      } else {
        return <h1>No offers</h1>
      }
    } else{
      if(filtredSellOffers.length !== 0){
        return( 
          <ul className='market-list'>
            {filtredSellOffers.map(offer => 
              <li className="market-list__item" key={offer.id}>
                <p className='offer-project'>{offer.project}</p>
                <p className='offer-rating'>0.00</p>
                <p className='offer-description'>{offer.shortDescription}</p>
                <p className='offer-price'>{offer.price}</p>
                <Link to={`/sell-offer/${offer.id}`} >
                  <p className='offer-button_btn'>Buy</p>
                </Link>
              </li>
            )}
          </ul>
        )
      } else {
        return <h1>No offers</h1>
      }
    }
  }
  return (
    <div className="market">
        {whichList()}
    </div>
  )
}

export default OffersList