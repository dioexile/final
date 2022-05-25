import { Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { Checkbox } from 'antd';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { editOffer } from '../../http/offerApi';
import { useNavigate } from 'react-router-dom';

const EditForm = () => {
  const { Option } = Select;
  const [contract, setContract] = useState(false)
  const [selected, setSelected] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [project, setProject] = useState('')
  const [wallet, setWallet] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')
  const [price, setPrice] = useState('')
  const {id} = useParams()
  let navigate = useNavigate();
  const prc = () => {
    setContract(!contract)
  }
  useEffect(()=>{
    const getOffer = async ()=>{
      const {data} = await axios.get('http://localhost:5000/api/offer/' + id)
      setProject(data.project)
      setWallet(data.wallet)
      setShortDescription(data.shortDescription)
      setFullDescription(data.fullDescription)
      setPrice(data.price)
    }
    getOffer()
  }, [])
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
  const edit = async (e) => {
    try {
      e.preventDefault()

      if(contract){
        await editOffer(id, project, wallet,`contract price`, shortDescription, fullDescription)
      } else{
        await editOffer(id, project, wallet, price + ` ${selected}`, shortDescription, fullDescription)
      }
      setProject('')
      setWallet('')
      setShortDescription('')
      setFullDescription('')
      setPrice('')
      message.success('Offer edited')
      navigate('../../')
    } catch (e) {
        message.error(e.response.data.message)
    }
  }
  return (
    <form className='offer-form' onSubmit={edit}>
        <h2 className='offer-title'>Edit offer</h2>
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
        <button className="offer-formbtn">Edit offer</button>
      </form>
  )
}

export default EditForm
