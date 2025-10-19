import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Auth.css';
import { FiUser, FiMail, FiLock, FiUsers, FiMapPin, FiBriefcase, FiPhone, FiClock,FiTag } from 'react-icons/fi';


const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('customer');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [location,setLocation]=useState('');
  // 1. Add new state for phone and business hours
  const [phone, setPhone] = useState('');
  const [businessHours, setBusinessHours] = useState('');
// const [businessCategory, setBusinessCategory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      // 3. Send the new data to the backend
      await api.post('/api/auth/register', { 
        name, email, password, accountType,
        businessName: accountType === 'vendor' ? businessName : undefined,
        address: accountType === 'vendor' ? address : undefined,
        phone: accountType === 'vendor' ? phone : undefined,
        businessHours: accountType === 'vendor' ? businessHours : undefined,
        //category: accountType === 'vendor'?businessCategory:undefined,
      });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      alert(message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <form onSubmit={handleSubmit}>
          <h2>Create Your Account</h2>
          <div className="input-group"><FiUser className="input-icon" /><input type="text" placeholder="Your Full Name" value={name} onChange={e => setName(e.target.value)} required className="input-field"/></div>
          <div className="input-group"><FiMail className="input-icon" /><input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="input-field"/></div>
          <div className="input-group"><FiLock className="input-icon" /><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="input-field"/></div>
          <div className="input-group"><FiUsers className="input-icon" /><select value={accountType} onChange={e => setAccountType(e.target.value)} required className="input-field"><option value="customer">I am a Customer</option><option value="vendor">I am a Vendor</option></select></div>
          
          {accountType === 'vendor' && (
            <>
              <div className="input-group"><FiBriefcase className="input-icon" /><input type="text" placeholder="Business Name" value={businessName} onChange={e => setBusinessName(e.target.value)} required className="input-field"/></div>
              <div className="input-group"><FiMapPin className="input-icon" /><input type="text" placeholder="Business Address" value={address} onChange={e => setAddress(e.target.value)} required className="input-field"/></div>
              <div className="input-group"><FiMapPin className="input-icon" /><input type="text" placeholder="Area Name" value={location} onChange={e => setLocation(e.target.value)} required className="input-field"/></div>

               {/*  <div className="input-group">
                <FiTag className="input-icon" />
                <select value={businessCategory} onChange={e => setBusinessCategory(e.target.value)} required className="input-field">
                  <option value="" disabled>Select a Business Category...</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>*/}
              {/* 2. Add new input fields to the form */}
              <div className="input-group">
                <FiPhone className="input-icon" />
                <input type="tel" placeholder="Contact Phone" value={phone} onChange={e => setPhone(e.target.value)} required className="input-field"/>
              </div>
              <div className="input-group">
                <FiClock className="input-icon" />
                <input type="text" placeholder="Business Hours (e.g., 9am - 5pm)" value={businessHours} onChange={e => setBusinessHours(e.target.value)} required className="input-field"/>
              </div>
            </>
          )}

          <button type="submit" className="auth-button">Sign Up</button>
        </form>
      </div>
      <p className="switch-auth-link"><Link to="/login">Already have an account? Sign In</Link></p>
    </div>
  );
};

export default SignUpPage;