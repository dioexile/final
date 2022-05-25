import React, {useContext, useState} from 'react';
import { signIn } from '../../../http/userApi';
import cl from './signin.module.css'
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import { message } from 'antd';

const Signin = observer(({visible, setVisible}) => {
  const {user} = useContext(Context)

  const rootClasses1 = [cl.overlay1]
  if (visible){
    rootClasses1.push(cl.active);
  }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signin = async (e) => {
    try {
      e.preventDefault()
      const data = await signIn(email, password)
      user.setUser(user)
      user.setIsAuth(true)
      setVisible(false)
      setPassword('')
      setEmail('')
    } catch (e) {
      message.error(e.response.data.message)
    }

  }
  return(

    <div className={rootClasses1.join(' ')} onClick={() => setVisible(false)}>
      <div className={cl.modalLogin1} onClick = {(e) => e.stopPropagation()}>
        <h3 className={cl.modalTitle1}>Sign-in</h3>
        <form method="post" onSubmit={signin}>
          <div className={cl.formInput1}>
            <div className={cl.formInput1}>
              <label htmlFor="email">EMAIL</label>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" id="email" placeholder='EMAIL' name ="email" required className={cl.modalInput1}/>
            </div>
            <div className={cl.formInput1}>
              <label htmlFor="password">PASSWORD</label>
              <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" id="password" placeholder='PASSWORD' name="password" required className={cl.modalInput1}/>
            </div>
          </div>
          <button className={cl.regbtn1}>Sign in</button>
        </form>
      </div>
    </div>

  );
});

export default Signin
