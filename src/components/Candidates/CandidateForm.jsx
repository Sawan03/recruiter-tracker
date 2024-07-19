import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';
import axios from 'axios';

const ApplicationsTable = () => {
  const [applications, setApplications] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/applications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setApplications(response.data || []);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        setSnackbarMessage('Failed to fetch applications');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };
    fetchApplications();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleViewResume = (resumePath) => {
    if (!resumePath) {
      setSnackbarMessage('Resume path is not available');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    
    // Construct the URL for viewing the resume
    const url = `http://localhost:5001/uploads/${resumePath.split('/').pop()}`;
    
    // Log the URL for debugging
    console.log('View Resume URL:', url);

    // Open the resume in a new tab
    window.open(url, '_blank');
  };

  const handleSendSchedule = async (email, schedule) => {
    if (!email || !schedule) {
      setSnackbarMessage('Email or schedule is missing');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/send-schedule-email', {
        email,
        schedule
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Response from server:', response.data);
      setSnackbarMessage('Schedule sent successfully');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Failed to send schedule:', error);
      setSnackbarMessage('Failed to send schedule');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>Applications</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Resume</TableCell>
              <TableCell>Interview Schedule</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map(application => (
              <TableRow key={application._id}>
                <TableCell>{application.name || 'N/A'}</TableCell>
                <TableCell>{application.email || 'N/A'}</TableCell>
                <TableCell>{application.phone || 'N/A'}</TableCell>
                <TableCell>
                  {application.resume ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewResume(application.resume)}
                    >
                      View Resume
                    </Button>
                  ) : 'No Resume'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleSendSchedule(application.email, application.interview_schedule)}
                  >
                    Send Schedule
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ApplicationsTable;
