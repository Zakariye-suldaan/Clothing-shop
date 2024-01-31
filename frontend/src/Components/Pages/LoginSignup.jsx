import React, { useState } from 'react';
import '../Pages/CSS/LoginSignup.css';
import eye from '../Assets/eye.png';
import hide_eye from '../Assets/hide_eye.png';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginSignup = () => {
  const [state, setState] = useState('Login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const showToast = (message, type) => {
    toast[type](message, {
      position: 'top-center',
      closeButton: false,
    });
  };
  const clearFields = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
    });
  }

  const login = async () => {
    if (!formData.email || !formData.password) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    console.log('login function executed', formData);
    let responseData;
    try {
      const response = await fetch('http://localhost:7000/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      responseData = await response.json();
    } catch (error) {
      console.error('Error during login:', error);
      showToast('An error occurred. Please try again later.', 'error');
      return;
    }

    if (responseData.success) {
      showToast('Login successful', 'success');
      const token = responseData.Token;  // Corrected line
      localStorage.setItem('auth-token', token);
      const user = responseData.user;  // Use responseData.user for user data
      localStorage.setItem('user', JSON.stringify(user));
      window.location.replace('/shop');
    } else {
      showToast(responseData.error, 'error');
    }
  };

  const signup = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:7000/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        showToast('Signup successful', 'success');
        //localStorage.setItem('auth-token', data.token);
  
        // Redirect to login state after successful signup
        clearFields();
        setState('Login');
      } else {
        showToast(data.error, 'error');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      showToast('An error occurred. Please try again later.', 'error');
    }
  };
  
  return (
    <div className='loginsignup'>
      <div className='loginsignup-container'>
        <h1>{state}</h1>
        <div className='loginsignup-fields'>
          {state === 'Sign Up' ? (
            <input name='name' onChange={changeHandler} value={formData.name} type='text' required placeholder='Your Name' />
          ) : (
            <></>
          )}
          <input name='email' onChange={changeHandler} value={formData.email} type='email' required placeholder=' Your Email' />
          <div className='password-container'>
            <input
              name='password'
              onChange={changeHandler}
              value={formData.password}
              type={showPassword ? 'text' : 'password'}
              required
              placeholder='Your Password'
            />
            <img
              src={showPassword ? hide_eye : eye}
              alt='Toggle Password Visibility'
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>
        <button onClick={() => (state === 'Login' ? login() : signup())}>
          {state === 'Login' ? 'Login' : 'Sign Up'}
        </button>
        {state === 'Sign Up' ? (
          <p className='ls-login'>
            Already have an account? <span onClick={() => setState('Login')} style={{ cursor: 'pointer' }}> Login Here</span>
          </p>
        ) : (
          <p className='ls-login'>
            Create an account? <span onClick={() => setState('Sign Up')} style={{ cursor: 'pointer' }}>Click Here</span>
          </p>
        )}
        {state === 'Login' && (
          <p className='ls-forgot-password'>
            <Link to="/forget-password" style={{
              cursor: 'pointer', textDecoration: 'none',
              color: 'black', fontWeight: 'bold'
            }}>
              Forgot Password
            </Link>
          </p>
        )}

        {/* Include ToastContainer at the end of your component */}
        <ToastContainer position="top-center" closeButton={false} />
      </div>
    </div>
  );
};

export default LoginSignup;
