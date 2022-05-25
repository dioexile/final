import { Select } from 'antd';
import React, { useState } from 'react'
import { Checkbox } from 'antd';
import { createOffer } from '../../http/offerApi';
import { message } from 'antd';

const Offerform = () => {
  const { Option } = Select;
  const [selected, setSelected] = useState(' ')
  const [isChecked, setIsChecked] = useState(false)
  const [project, setProject] = useState('')
  const [wallet, setWallet] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')
  const [price, setPrice] = useState('')
  const [contract, setContract] = useState(false)

  function handleChange(value) {
    if(value === 'TRC20'){
      setSelected('USDT')
    }
    if(value === 'SOLANA'){
      setSelected('SOLANA')
    }
    if(value === 'BSC'){
      setSelected('BUSD')
    }
  }
  const prc = () => {
    setContract(!contract)
  }
  let styles = ['price-input']
  const handleChecked = () => {
    setIsChecked(!isChecked)
  }
  if(isChecked){
    styles.push('price')
  }
  if(!isChecked){
    styles = ['price-input']
  }
  const addOffer = async (e) => {
    try {
      let data;
      e.preventDefault()

      if(contract){
        data = await createOffer(project, wallet, `contract price`, shortDescription, fullDescription)
      } else{
        data = await createOffer(project, wallet, price + ` ${selected}`, shortDescription, fullDescription)
      }
      setProject('')
      setWallet('')
      setShortDescription('')
      setFullDescription('')
      setPrice('')
      message.success('Offer created')
    } catch (e) {
        message.error(e.response.data.message)
    }
  }
  return (
    <form className='offer-form' onSubmit={addOffer}>
        <h2 className='offer-title'>Create offer</h2>
        <div className="form-input">
          <label>Title</label>
          <input value={project} onChange={(e)=>setProject(e.target.value)} type="text" placeholder='Project name' required/>
        </div>
        <div className="form-input">
          <label>Wallet</label>
          <input value={wallet} onChange={(e)=>setWallet(e.target.value)} type="text" placeholder='Enter wallet address' required/>
        </div>
        <div className="form-input">
          <label>Short description</label>
          <input value={shortDescription} onChange={(e)=>setShortDescription(e.target.value)} type="text" placeholder='Short description' required/>
        </div>
        <div className="form-input">
          <label>Full description</label>
          <textarea value={fullDescription} onChange={(e)=>setFullDescription(e.target.value)} placeholder='Full description' required></textarea>
        </div>
        <div className="price-type">
          <h5>select payment type:</h5>
          <div className="checkboxes">
            <Checkbox defaultChecked={false} disabled = {isChecked} className='contract' onChange={prc}>Contract price</Checkbox>
            <Checkbox defaultChecked={false} className='fixed' onChange={handleChecked} >Fixed price</Checkbox>
          </div>
        </div>
        <div className={styles.join(' ')}>
          <label>Price</label>
          <input value={price} onChange={(e)=>setPrice(e.target.value)} type="text" placeholder='Enter a value' />
          <div className="selected">
            <Select defaultValue="Network" onChange={handleChange} >
              <Option value="BSC">BSC</Option>
              <Option value="TRC20">TRC20</Option>
              <Option value="SOLANA">SOLANA</Option>
            </Select>
            <span className='token'>
              {selected === 'BUSD' && ' BUSD'}
              {selected === 'USDT' && ' USDT'}
              {selected === 'SOLANA' && ' SOLANA'}
            </span>
          </div>
        </div>
        <button className="offer-formbtn">Add Offer</button>
      </form>
  )
}

export default Offerform

