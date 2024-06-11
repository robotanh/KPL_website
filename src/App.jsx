import { useState } from 'react'
import React from 'react';
import './styles/App.css'
import Header from './Header'
import Sidebar from './Sidebar'
import Home from './Home'
import Login from './Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
      <React.StrictMode>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Home />} />
          </Routes>
        </Router>
      </React.StrictMode>
    
  );
}

export default App
