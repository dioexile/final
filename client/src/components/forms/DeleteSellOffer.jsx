import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeleteForm = ({id, deleteForm, setDeleteForm}) => {

  
  const deleteOffer = async () => {
    await axios.delete('http://localhost:5000/api/purchase-offer/' + id)
    navigate(-1)
  }
  let navigate = useNavigate();

  return (
  <div className='overlay'>
    <div className='delete-form'>
      <h1>Are you sure want to delete it?</h1>
      <div className="delete-buttons">
        <button onClick={deleteOffer}>Yes</button>
        <button onClick={() => setDeleteForm(false)}>No</button>
      </div>
    </div>
  </div>
  )
}

export default DeleteForm