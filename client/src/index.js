import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './css/normalize.css'
import 'antd/dist/antd.css';
import App from './App';
import UserStore from "./store/UserStore";
import OfferStore from "./store/OfferStore";

const root = ReactDOM.createRoot(document.getElementById('root'));

export const Context = createContext(null)

root.render(
  <Context.Provider value={{
    user: new UserStore(),
    offer: new OfferStore()
  }}>
    <App/>
  </Context.Provider>
);

