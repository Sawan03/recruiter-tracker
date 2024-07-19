import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5001/api/login', { email, password });
      const { token } = response.data;
      
      // Decode token to get user role
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Extract payload from JWT
      const userRole = decodedToken.role;
      
      // Store token and role in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      
      // Redirect based on user role
      if (userRole === 'HR Manager') {
        navigate('/dashboard');
      } else if (userRole === 'Recruiter') {
        navigate('/candidates');
      } else {
        navigate('/');
      }
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
      console.error('Login failed:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      {message && <Typography variant="h6" color="error">{message}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Login</Button>
      </form>
    </Container>
  );
};

export default Login;
