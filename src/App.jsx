import { useState } from 'react'
import './styles/App.css'
import Header from './Header'
import Sidebar from './Sidebar'
import Home from './Home'
import Login from './Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Router>
      <div className='grid-container'>
        <Header OpenSidebar={OpenSidebar} />
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <main>
          <Routes>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/" element={<Login />} />
            {/* Add other routes here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
