import { useState } from 'react';
import './styles/App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import { Routes, Route } from 'react-router-dom';
import RT_Dashboard from './app_pages/RT_Dashboard';
import Hist_data from './app_pages/Hist_data';
import Settings from './app_pages/Settings';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [theme, setTheme] = useState('dark'); // Add theme state

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'bright' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  return (
    <div className={`grid-container ${theme}`}>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <main>
        <Routes>
          <Route path="/dashboard" element={<RT_Dashboard theme={theme} />}  />
          <Route path="/hist_data" element={<Hist_data theme={theme} />} />
          <Route path="/settings" element={<Settings toggleTheme={toggleTheme} theme={theme}/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
