import React from 'react';
import { Container, Typography } from '@mui/material';
import CandidateForm from '../components/Candidates/CandidateForm';
import CandidateList from '../components/Candidates/CandidateList';

const CandidatesPage = () => {
  return (
    <Container>
      <Typography variant="h4">Candidates</Typography>
      <CandidateForm onSave={(candidate) => console.log('Candidate saved:', candidate)} />
      <CandidateList />
    </Container>
  );
};

export default CandidatesPage;
