import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage.jsx';
import SignUpPage from './pages/Auth/SignUpPage.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx'; 
import VendorPublicPage from './pages/Dashboard/VendorPublicPage.jsx';
// import DashboardIndex from './pages/Dashboard/DashboardIndex'; 
// import MyShop from './pages/Dashboard/MyShop';
// import Settings from './pages/Dashboard/Settings';
// import Messages from './pages/Dashboard/Messages';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vendors/:id" element={<VendorPublicPage />} />
       
      </Routes>
    </div>
  );
}

export default App;