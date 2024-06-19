import React from 'react';
import '../styles/Settings.css'; 
function Settings({ toggleTheme, theme }) {
    return (
      <div className={`settings ${theme}`}>
        <h1>Cài đặt</h1>
        <button onClick={toggleTheme}>Đổi màu sắc</button>
      </div>
    );
  }

export default Settings;
