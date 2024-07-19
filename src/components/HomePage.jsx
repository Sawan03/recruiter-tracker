import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Card, CardContent, CardActions } from '@mui/material';
import axios from 'axios';
import ApplicationForm from './ApplicationForm'; // Import the new component

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/job-postings');
        setJobs(response.data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const handleApplyNowClick = (jobId) => {
    setSelectedJobId(jobId);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedJobId(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Job Postings
      </Typography>
      {jobs.length > 0 ? (
        jobs.map(job => (
          <Card key={job._id} style={{ marginBottom: '1rem' }}>
            <CardContent>
              <Typography variant="h6">{job.title}</Typography>
              <Typography variant="body2">{job.department}</Typography>
              <Typography variant="body2">{job.location}</Typography>
              <Typography variant="body2">{job.job_type}</Typography>
              <Typography variant="body2">{job.description}</Typography>
              <Typography variant="body2">Deadline: {new Date(job.application_deadline).toLocaleDateString()}</Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" onClick={() => handleApplyNowClick(job._id)}>
                Apply Now
              </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <Typography>No job postings available.</Typography>
      )}
      {selectedJobId && (
        <ApplicationForm
          open={openForm}
          handleClose={handleCloseForm}
          jobId={selectedJobId}
        />
      )}
    </Container>
  );
};

export default HomePage;
