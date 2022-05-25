import React, { useContext } from 'react'
import {
  Routes,
  Route,
} from "react-router-dom";
import Profile from './pages/Profile';
import BuyOffer from './pages/BuyOffer';
import SellOffer from './pages/SellOffer';
import Market from './pages/Market';
import Offer from './pages/Offer';
import Offer2 from './pages/Offer2';
import { Context } from './index';
import Messages from './pages/Messages';
import Favorites from './components/Favourites';
import Edit from './pages/Edit';


export const useRoutess= () => {

  const {user} = useContext(Context)
  return (
    <Routes>
      <Route path="/" element={<Market />}/>
      {user.isAuth ? <Route path={`/profile/:id` } element={<Profile />}/> : <Route path="*" element={<Market/>}/>}
      <Route path="/create-offer" element={<Offer />}/>
      <Route path="/sell-offer" element={<Offer2 />}/>
      <Route path="/sell-offer/:id" element={<SellOffer />}/>
      <Route path="/offer/:id" element={<BuyOffer />}/>
      <Route path="/offer/:id" element={<BuyOffer />}/>
      <Route path="/favourites/" element={<Favorites />}/>
      <Route path="/messages/*" element={<Messages />}/>
      <Route path="/edit/:id" element={<Edit />}/>

      <Route path="*" element={<Market/>}/>
    </Routes>
  )
}