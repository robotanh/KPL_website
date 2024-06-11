// Login.jsx
import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import UserStore from './store/UserStore';
import LoginForm from './LoginForm';
import SubmitButton from './SubmitButton';
import '../styles/Login.css';



const Login = observer(() => {
  const navigate = useNavigate();

  React.useEffect(() => {
    UserStore.checkLoggedInStatus();
  }, []);

  

  console.log('Login.jsx: Real value of UserStore.isLoggedIn = ', UserStore.isLoggedIn);

  
  if (UserStore.isLoggedIn) {
    navigate('/dashboard');
    return null;  // Return null to avoid rendering the component
  }

  console.log('Login.jsx: Returned back to Log in page');
  return (
    <div className="login">
      <div className='container'>
        <LoginForm />
      </div>
    </div>
  );
});

export default Login; 
