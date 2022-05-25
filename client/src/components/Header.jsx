import React, {useState, useContext, useEffect} from 'react'
import { Link } from 'react-router-dom'
import '../css/header.css'
import Signin from './forms/signin/Signin'
import Login from './forms/login/Login'
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import ProfileHeader from './ProfileHeader'

const Header = () => {
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const {user} = useContext(Context)

  

  return (
    <header>
      <div className="header">
        <div className="left">
          <div className="logo">
            <Link to='/'>
              <img src="/img/logo2.png" alt="" className='logoimg'/>
            </Link>
          </div>
          <nav>
            <ul className="navbar">
            <Link to="/" className='link'>
              <li className="navbar-item">Market</li>
            </Link>
              <li className="navbar-item">Socials</li>  
              <li className="navbar-item">FAQ</li>
              <a href="https://discord.gg/Gdrqxnak">  
                <li className="navbar-item discord">
                  <span>Support</span>
                  <img src="/img/ds.svg" alt="" />
                </li>
              </a>
            </ul>
          </nav>
        </div>

        {!user.isAuth ?
          <div className="auth">
            <div className="auth-btn">
              <button className='login' onClick={() => setModal(true)}>login</button>
            </div>
            <div className="auth-btn">
              <button className='signin' onClick={() => setModal1(true)}>sign-in</button>
            </div>  
          </div>
          :
          <ProfileHeader user={user}/>
        }

      </div>
        <Signin visible={modal1} setVisible = {setModal1}/>
        <Login visible={modal} setVisible = {setModal}/> 
    </header>
  )
}

export default Header