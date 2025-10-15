// import { Routes, Route } from 'react-router-dom';
// import LoginPage from './pages/Auth/LoginPage.jsx';
// import SignUpPage from './pages/Auth/SignUpPage.jsx';
// import Dashboard from './pages/Dashboard/Dashboard.jsx'; 
// import VendorPublicPage from './pages/Dashboard/VendorPublicPage.jsx';
// import Settings from './pages/Dashboard/Settings.jsx'; 
// // import DashboardIndex from './pages/Dashboard/DashboardIndex'; 
// // import MyShop from './pages/Dashboard/MyShop';
// // import Settings from './pages/Dashboard/Settings';
// // import Messages from './pages/Dashboard/Messages';
// function App() {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignUpPage />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/vendors/:id" element={<VendorPublicPage />} />
//         <Route path="/settings" element={<Settings />} />

//       </Routes>
//     </div>
//   );
// }

// export default App;
// In App.jsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage.jsx';
import SignUpPage from './pages/Auth/SignUpPage.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx'; 
import VendorPublicPage from './pages/Dashboard/VendorPublicPage.jsx';
import DashboardIndex from './pages/Dashboard/DashboardIndex.jsx'; // Make sure this is created and imported
import MyShop from './pages/Dashboard/MyShop.jsx';
import Settings from './pages/Dashboard/Settings.jsx';
import Messages from './pages/Dashboard/Messages.jsx';

function App() {
  return (
    <div>
      <Routes>
        {/* Top-level routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/vendors/:id" element={<VendorPublicPage />} />

        {/* This is the correct nested structure for your dashboard */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* The default page to show at "/dashboard" */}
          <Route index element={<DashboardIndex />} /> 
          
          {/* Child pages that will render inside the Dashboard layout */}
          <Route path="my-shop" element={<MyShop />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;