import React from 'react';
import { Container, Typography } from '@mui/material';
import JobPostingForm from '../components/JobPostings/JobPostingForm';
import JobPostingList from '../components/JobPostings/JobPostingList';

const JobPostingsPage = () => {
  return (
    <Container>
      <Typography variant="h4">Job Postings</Typography>
      <JobPostingForm onSave={(job) => console.log('Job saved:', job)} />
      <JobPostingList />
    </Container>
  );
};

export default JobPostingsPage;
