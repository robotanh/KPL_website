import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Login from './login_logout_components/Login.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app/*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
