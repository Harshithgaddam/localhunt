import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage.jsx';
import SignUpPage from './pages/Auth/SignUpPage.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx'; 

function App() {
  return (
    <div>
      <Routes>
        {/* Route for the login page (e.g., at the root path '/') */}
        <Route path="/" element={<LoginPage />} />
        
        {/* You can also be more explicit for the login path */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route for the sign-up page */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;