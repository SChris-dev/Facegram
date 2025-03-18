import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// css
import './assets/css/style.css';
import './assets/css/bootstrap.css';

import Master from "./Master";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Master/>}>
            <Route path="" element={<Home/>}></Route>
            <Route path="login" element={<Login/>}></Route>
            <Route path="register" element={<Register/>}></Route>
            <Route path="profile/:username" element={<UserProfile/>}></Route>
            <Route path="create-post" element={<CreatePost/>}></Route>
          </Route>  
        </Routes>  
      </Router>      
    </>
  )
}

export default App
