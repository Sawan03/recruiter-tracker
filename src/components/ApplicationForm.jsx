import React, { useState } from 'react';
import { Modal, Button, TextField, Typography, Input, Container } from '@mui/material';
import axios from 'axios';

const ApplicationForm = ({ open, handleClose, jobId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [applicationStatus] = useState('Pending');
  const [interviewSchedule] = useState([]);

  const handleFileChange = (event) => {
    setResume(event.target.files[0]);
  };

  const handleDocumentsChange = (event) => {
    setDocuments([...event.target.files]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('resume', resume);
    documents.forEach((file, index) => formData.append(`documents[${index}]`, file));
    formData.append('job_posting_id', jobId);
    formData.append('application_status', applicationStatus);
    formData.append('interview_schedule', JSON.stringify(interviewSchedule));

    try {
      await axios.post('http://localhost:5001/api/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      handleClose();
    } catch (error) {
      console.error('Failed to apply:', error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Container style={{ marginTop: '5rem', padding: '2rem', backgroundColor: 'white' }}>
        <Typography variant="h6" gutterBottom>Apply for Job</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <label>Resume</label>
          <Input
            type="file"
            onChange={handleFileChange}
            fullWidth
            required
            margin="normal"
          />
          <label>Cover Latter</label>
          <Input
            type="file"
            multiple
            onChange={handleDocumentsChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem' }}>
            Submit Application
          </Button>
        </form>
      </Container>
    </Modal>
  );
};

export default ApplicationForm;
