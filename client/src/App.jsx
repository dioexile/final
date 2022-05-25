import React, { useContext,useEffect,useState } from 'react'
import './css/normalize.css'
import {BrowserRouter} from "react-router-dom";
import Header from './components/Header';
import 'antd/dist/antd.css';
import { useRoutess } from './routes';
import {observer} from "mobx-react-lite";
import { Context } from '.';
import { check } from './http/userApi';

const App = observer(() => {
  const routes = useRoutess(true)
  const {user} = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      check().then(() => {
        user.setUser(true)
        user.setIsAuth(true)
      }).finally(() => setLoading(false))
  }, [])

  if(loading){
    return <div className="spinner"></div>
  }

  return (
    <BrowserRouter>
      <Header/>
      {routes}
    </BrowserRouter>
  )
})

export default App