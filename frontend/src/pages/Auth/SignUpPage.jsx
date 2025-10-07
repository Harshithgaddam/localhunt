// // import React, { useState } from 'react';
// // import { useNavigate, Link } from 'react-router-dom';
// // import axios from 'axios';
// // import './Auth.css';
// // import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiMapPin ,FiUsers} from 'react-icons/fi';

// // const SignUpPage = () => {
// //   const [name, setName] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [showPassword, setShowPassword] = useState(false);
// //   const navigate = useNavigate();
// //   const [accountType, setAccountType] = useState('customer');
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       // This is the new logic that sends data to your server
// //       await axios.post('/api/auth/register', { 
// //         name, 
// //         email, 
// //         password ,
// //         accountType
// //       });

// //       console.log('Registration request sent successfully!');
// //       alert('Registration successful! Please log in.');
// //       navigate('/login'); // Redirect to login after success
      
// //     } catch (error) {
// //       console.error('Registration failed:', error.response?.data?.message || error.message);
// //       alert('Registration failed. The email may already be in use.');
// //     }
// //   };

// //   return (
// //     <div className="auth-container">
// //       <div className="logo-container">
// //         <div className="logo">
// //           <FiMapPin size={40} />
// //           <span>Local Hunt</span>
// //         </div>
// //         <p className="tagline">Discover local vendors in your area</p>
// //       </div>

// //       <div className="auth-form-container">
// //         <form onSubmit={handleSubmit}>
// //           <h2>Create Your Account</h2>
// //           <div className="input-group">
// //             <FiUser className="input-icon" />
// //             <input
// //               type="text"
// //               placeholder="Enter your full name"
// //               className="input-field"
// //               value={name}
// //               onChange={(e) => setName(e.target.value)}
// //               required
// //             />
// //           </div>
// //           <div className="input-group">
// //             <FiMail className="input-icon" />
// //             <input
// //               type="email"
// //               placeholder="Enter your email"
// //               className="input-field"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               required
// //             />
// //           </div>
// //           <div className="input-group">
// //             <FiUsers className="input-icon" />
// //             <select
// //               className="input-field"
// //               value={accountType}
// //               onChange={(e) => setAccountType(e.target.value)}
// //               required
// //             >
// //               <option value="customer">Customer</option>
// //               <option value="vendor">Vendor</option>
// //             </select>
// //           </div>
// //           <div className="input-group">
// //             <FiLock className="input-icon" />
// //             <input
// //               type={showPassword ? 'text' : 'password'}
// //               placeholder="Create a password"
// //               className="input-field"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               required
// //             />
// //             <span
// //               className="password-toggle-icon"
// //               onClick={() => setShowPassword(!showPassword)}
// //             >
// //               {showPassword ? <FiEyeOff /> : <FiEye />}
// //             </span>
// //           </div>
// //           <button type="submit" className="auth-button">Sign Up</button>
// //         </form>
// //       </div>

// //       <p className="switch-auth-link">
// //         Already have an account? <Link to="/login">Sign In</Link>
// //       </p>
// //     </div>
// //   );
// // };

// // export default SignUpPage;
// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import './Auth.css';
// import { FiUser, FiMail, FiLock, FiUsers, FiMapPin, FiBriefcase } from 'react-icons/fi';

// const SignUpPage = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [accountType, setAccountType] = useState('customer');
//   const [businessName, setBusinessName] = useState('');
//   const [address, setAddress] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (businessName.length < 3) {
//       setSuggestions([]);
//       return;
//     }
//     const handler = setTimeout(() => {
//       axios.get(`/api/places/autocomplete?input=${businessName}`)
//         .then(response => setSuggestions(response.data))
//         .catch(console.error);
//     }, 300);
//     return () => clearTimeout(handler);
//   }, [businessName]);

//   const handleSelectSuggestion = async (place_id) => {
//     try {
//       const response = await axios.get(`/api/places/details/${place_id}`);
//       const { name, formatted_address } = response.data;
//       setBusinessName(name);
//       setAddress(formatted_address);
//       setSuggestions([]);
//     } catch (error) {
//       console.error('Failed to fetch place details:', error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/auth/register', { 
//         name, email, password, accountType,
//         businessName: accountType === 'vendor' ? businessName : undefined,
//         address: accountType === 'vendor' ? address : undefined,
//       });
//       alert('Registration successful! Please log in.');
//       navigate('/login');
//     } catch (error) {
//       alert('Registration failed. The email may already be in use.');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-form-container">
//         <form onSubmit={handleSubmit}>
//           <h2>Create Your Account</h2>
//           <div className="input-group"><FiUser className="input-icon" /><input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required/></div>
//           <div className="input-group"><FiMail className="input-icon" /><input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/></div>
//           <div className="input-group"><FiLock className="input-icon" /><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/></div>
//           <div className="input-group"><FiUsers className="input-icon" /><select value={accountType} onChange={e => setAccountType(e.target.value)} required><option value="customer">I am a Customer</option><option value="vendor">I am a Vendor</option></select></div>
          
//           {accountType === 'vendor' && (
//             <>
//               <div className="input-group autocomplete-container">
//                 <FiBriefcase className="input-icon" />
//                 <input type="text" placeholder="Business Name" value={businessName} onChange={e => setBusinessName(e.target.value)} required/>
//                 {suggestions.length > 0 && (
//                   <ul className="suggestions-list">
//                     {suggestions.map(s => <li key={s.place_id} onClick={() => handleSelectSuggestion(s.place_id)}>{s.description}</li>)}
//                   </ul>
//                 )}
//               </div>
//               <div className="input-group"><FiMapPin className="input-icon" /><input type="text" placeholder="Business Address" value={address} onChange={e => setAddress(e.target.value)} required/></div>
//             </>
//           )}

//           <button type="submit" className="auth-button">Sign Up</button>
//         </form>
//       </div>
//       <p className="switch-auth-link">Already have an account? <Link to="/login">Sign In</Link></p>
//     </div>
//   );
// };

// export default SignUpPage;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import { FiUser, FiMail, FiLock, FiUsers, FiMapPin, FiBriefcase, FiPhone, FiClock,FiTag } from 'react-icons/fi';

// const categories = [
//   'Electronics',
//   'Vegetables',
//   'Kirana Store',
//   'Bakery',
//   'Beauty & Cosmetics',
//   'Mall',
//   'Supermarket',
//   'Book Store',
//   'Clothing',
//   'Restaurant',
//   'Other'
// ];
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
      await axios.post('/api/auth/register', { 
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