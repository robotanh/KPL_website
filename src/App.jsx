import { useState } from 'react';
import './styles/App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import { Routes, Route } from 'react-router-dom';


import RT_Dashboard from './app_pages/RT_Dashboard';
import Hist_data from './app_pages/Hist_data';

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
          <Route path="/dashboard" element={<RT_Dashboard />} />
          <Route path="/hist_data" element={<Hist_data />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
