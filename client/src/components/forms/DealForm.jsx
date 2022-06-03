import React, {useEffect, useState, useRef} from 'react';
import { Input } from 'antd';

const DealForm = ({setVisible, you}) => {
  const [wallet, setWallet] = useState('')
  const [price, setPrice] = useState('')


  return (
    <div className='overlay'>
      <div className='buy-form'>
        <img src="/img/close.svg" alt="" className='close' onClick={()=>setVisible(false)}/>
        <h1 className='deal-title'>Start a deal with {you.username}</h1>
        <form>
          <div className='buy-form__input'>
            <div className="form-input">
              <label>Wallet</label>
              <input value={wallet} onChange={(e)=>setWallet(e.target.value)} type="text" placeholder='Please enter your wallet address' required/>
            </div>
            <div className='price-input price'>
              <label>Price</label>
              <input value={price} onChange={(e)=>setPrice(e.target.value)} type="text" placeholder='Please enter a value' />
            </div>
          </div>
          <button className='buy-form__btn'>Complete</button>
        </form>
      </div>
    </div>
  )
}

export default DealForm