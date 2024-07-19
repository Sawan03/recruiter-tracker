import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Auth/Register.jsx';
import Login from './components/Auth/Login.jsx';
import JobPost from './components/JobPostings/JobPostingForm.jsx';
import Candidates from './components/Candidates/CandidateForm.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './components/HomePage.jsx'
import {jwtDecode} from 'jwt-decode'; // Ensure you have installed this package



const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && token.split('.').length === 3) {
      try {
        jwtDecode(token);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Token decoding failed:", e);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  return (
  
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/job-postings"
          element={
            <ProtectedRoute element={<JobPost />} />
          }
        />
        <Route
          path="/candidates"
          element={
            <ProtectedRoute element={<Candidates />} />
          }
        />
        <Route path="/" element={<Home />} /> {/* Add your Home component */}
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to Home for unknown routes */}
      </Routes>
    </Router>
  
  );
};

export default App;