import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');

      if (token && token.split('.').length === 3) {
        try {
          const response = await axios.get('http://127.0.0.1:5001/api/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserRole(response.data.role);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();

    // Add event listener for localStorage changes
    window.addEventListener('storage', fetchUserRole);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('storage', fetchUserRole);
  }, []); // Empty dependency array ensures this runs on mount only

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(null); // Clear user role
    navigate('/login'); // Redirect to login
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Recruitment Tracker
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        {userRole ? (
          <>
            {(userRole === 'HR Manager' || userRole === 'Recruiter') && (
              <Button color="inherit" component={Link} to="/candidates">Candidates</Button>
            )}
            {userRole === 'HR Manager' && (
              <Button color="inherit" component={Link} to="/job-postings">Job Postings</Button>
            )}
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
