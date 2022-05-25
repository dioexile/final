import React, {useContext, useState} from 'react';
import { registration } from '../../../http/userApi';
import cl from './login.module.css'
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import { message } from 'antd';


const Login = observer(({visible, setVisible}) => {

  const {user} = useContext(Context)

  const rootClasses = [cl.overlay]
  if (visible){
    rootClasses.push(cl.active);
  }
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = async (e) => {
    try {
      e.preventDefault()
      const data = await registration(email, password, username)
      user.setUser(user)
      user.setIsAuth(true)
      setVisible(false)
      setPassword('')
      setEmail('')
      setUsername('')
    } catch(e) {
      message.error(e.response.data.message)
    }
  }
  const validate = () => {
    
  }
  return (
    <div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
      <div className={cl.modalLogin} onClick = {(e) => e.stopPropagation()}>
        <h3 className={cl.modalTitle}>LOGIN</h3>
        <form method="post" onSubmit={login}>
          <div className={cl.formInput}>

            <label>USERNAME</label>
            <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder='USERNAME' name='username' className={cl.modalInput}/>

            <label>EMAIL</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='EMAIL' type='email' name='email'  className={cl.modalInput} />

            <label>PASSWORD</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='PASSWORD'  type='password' name='password' className={cl.modalInput} />
            {validate()}
          </div>
          <button className={cl.regbtn} >Log in</button>
        </form>
      </div>
    </div>
  )
})

export default Login


