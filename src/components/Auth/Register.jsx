import React, { useState } from 'react';
import { TextField, Button, Container, Typography, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5001/api/register', { username, password, email, role });
      setMessage(response.data.msg);
      navigate('/login');
    } catch (error) {
      setMessage(error.response.data.msg || 'Registration failed');
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Register</Typography>
      {message && <Typography variant="h6" color="error">{message}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="HR Manager">HR Manager</MenuItem>
          <MenuItem value="Recruiter">Recruiter</MenuItem>
          {/* Add more roles as needed */}
        </TextField>
        <Button type="submit" variant="contained" color="primary">Register</Button>
      </form>
    </Container>
  );
};

export default Register;
