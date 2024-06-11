import { useState } from 'react';
import './styles/App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <main>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
