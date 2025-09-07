import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import axios from 'axios'; // Import axios
import './Auth.css';
import { FiMail, FiLock, FiEye, FiEyeOff, FiMapPin } from 'react-icons/fi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // This is the main function to update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send a POST request to the backend login endpoint using a relative URL
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      // 2. If login is successful, save the token to localStorage
      localStorage.setItem('token', response.data.token);
      console.log('Login successful:', response.data);
      
      // 3. Redirect to a dashboard or home page
      // NOTE: You will need to create a route and a component for '/dashboard'
      navigate('/Dashboard'); 

    } catch (error) {
      // 4. If login fails, show an error message
      console.error('Login failed:', error.response?.data?.message || error.message);
      alert('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-container">
        <div className="logo">
          <FiMapPin size={40} />
          <span>Local Hunt</span>
        </div>
        <p className="tagline">Discover local vendors in your area</p>
      </div>

      <div className="auth-form-container">
        <form onSubmit={handleSubmit}>
          <h2>Sign In to Your Account</h2>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <div className="demo-accounts">
          <h3>Demo Accounts:</h3>
          <div className='demo-account-item'>
              <span>User</span>
              <span>user@localhunt.com</span>
          </div>
          <div className='demo-account-item'>
              <span>Vendor</span>
              <span>vendor@localhunt.com</span>
          </div>
          <div className='demo-account-item'>
              <span>Admin</span>
              <span>admin@localhunt.com</span>
          </div>
        </div>
      </div>
      <p className="switch-auth-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;