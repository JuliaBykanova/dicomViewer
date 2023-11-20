import React from 'react';
import { Layout } from './components/Layout';
import './main.global.css';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainPage } from './pages/MainPage';
import {store} from './redux/redux-store';
import { Provider } from 'react-redux';
import { initCornerstone } from './utils/initiators/initCornerstone';

 export function App() {
  initCornerstone();
  
  return(
    //<Provider store={store}>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path='/main' element={<MainPage/>}></Route>
            <Route path='/' element={ <Navigate to='/main'/> }/>
          </Routes>
        </BrowserRouter>
      </Layout>
    //</Provider>
  );
};

