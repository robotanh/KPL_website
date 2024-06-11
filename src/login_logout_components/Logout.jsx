// Logout.jsx
import React from 'react';
import UserStore from './store/UserStore';

const Logout = async () => {
  try {
    let res = await fetch('/logout', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    let result = await res.json();

    if (result && result.success) {
      UserStore.setLoggedIn(false);
      UserStore.setUsername('');
      console.log('Logout.jsx: Logged out successfully');
      await UserStore.checkLoggedInStatus();
    } else {
      console.log('Logout.jsx: Logout failed', result.msg);
    }
  } catch (e) {
    console.log(e);
  }
}

export default Logout;
