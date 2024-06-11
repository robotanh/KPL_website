// UserStore.jsx
import { makeAutoObservable } from "mobx";

class UserStore {
    isLoggedIn = false;
    username = '';

    constructor() {
        makeAutoObservable(this);
    }

    setLoggedIn(status) {
        this.isLoggedIn = status;
    }

    setUsername(username) {
        this.username = username;
    }

    checkLoggedInStatus = async () => {
        try {
          let res = await fetch('/isLoggedIn', {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          let result = await res.json();
      
          if (result && result.success) {
            this.setLoggedIn(true);
            this.setUsername(result.username);
            console.log('Login.jsx: UserStore.isLoggedIn = true');
            navigate('/dashboard');  
          } else {
            this.setLoggedIn(false);
            this.setUsername(''); // Clear username
            console.log('Login.jsx: UserStore.isLoggedIn = false');
          }
        } catch (e) {
            this.setLoggedIn(false);
            this.setUsername(''); // Clear username
          console.log('Login.jsx: UserStore.isLoggedIn = false');
        }
    }

}

export default new UserStore();
