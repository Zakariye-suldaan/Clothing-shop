import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/ForgetPassword.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add logic here to send a request to your server to initiate the password reset
    try {
      const response = await fetch('http://localhost:7000/forgetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Password reset link sent to your email', {
          position: 'top-center',
          closeButton: false, // Remove the close button
        });
        setEmail('');
        // close the connection
        window.exit(0);
      } else {
        toast.error(data.error, {
          position: 'top-center',
          closeButton: false, // Remove the close button
        });
      }
    } catch (error) {
      console.error('Error submitting forget password request:', error);
      toast.error('An error occurred. Please try again later.', {
        position: 'top-center',
        closeButton: false, // Remove the close button
      });
    }
  };

  return (
    <div className='forgetpassword'>
      <h2>Forget Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send</button>

        {/* Include ToastContainer at the end of your component */}
        <ToastContainer position="top-center" closeButton={false} />
      </form>
    </div>
  );
};

export default ForgetPassword;
