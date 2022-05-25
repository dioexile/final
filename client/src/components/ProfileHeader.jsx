import React from 'react'
import jwt_decode from "jwt-decode";
import { Link } from 'react-router-dom'

const ProfileHeader = ({user}) => {

  const logOut = () => {
    user.setUser({})
    user.setIsAuth(false)
    localStorage.removeItem('token')
  }
  const id = jwt_decode(localStorage.getItem('token')).id
  
  return (
    <div className="account-row">
      <div className="account-row__item">
        <Link to={'/favourites'}><img src="/img/favorites.svg" alt="" /></Link>
      </div>
      <div className="account-row__item" >
        <Link to={'/messages'}><img src="/img/message.svg" alt="" /></Link>
      </div>
      <div className="account-row__item mt9">
        <Link to={`/profile/${id}`}><img src="/img/profile.png" alt="" /></Link>
      </div>
      
    </div>
  )
}

export default ProfileHeader