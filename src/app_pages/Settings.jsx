import React from 'react';

function Settings({ toggleTheme }) {
  return (
    <div className="settings">
      <h1>Settings</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

export default Settings;
