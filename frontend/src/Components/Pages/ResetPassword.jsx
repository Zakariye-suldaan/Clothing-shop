import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/ResetPassword.css';
import eye from '../Assets/eye.png';
import hide_eye from '../Assets/hide_eye.png';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { id, token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  const showToast = (message, type) => {
    toast[type](message, {
      position: 'top-center',
      closeButton: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords don't match", 'error');
      return;
    }

    // Add logic here to send a request to your server to reset the password
    try {
      const response = await fetch(`http://localhost:7000/resetpassword/${id}/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Password updated successfully', 'success');
        // You can also redirect the user to a login page or another page after a successful password reset
        window.location.replace('/');
      } else {
        showToast(data.error, 'error');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      showToast('An error occurred. Please try again later.', 'error');
    }
  };

  return (
    <div className='resetpassword'>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="password">New Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <img
            src={showPassword ? hide_eye : eye}
            alt='Toggle Password Visibility'
            onClick={togglePasswordVisibility}
          />
        </div>
        <div className="input-container">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <img
            src={showConfirmPassword ? hide_eye : eye}
            alt='Toggle Password Visibility'
            onClick={toggleConfirmPasswordVisibility}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default ResetPassword;
