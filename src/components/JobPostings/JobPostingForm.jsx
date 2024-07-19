import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  Switch,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

const JobPostingForm = () => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [description, setDescription] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [visibilityStatus, setVisibilityStatus] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [jobs, setJobs] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Fetch job postings on component mount
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/job-postings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Failed to fetch job postings:', error);
      }
    };
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/job-postings', {
        title,
        department,
        location,
        jobType,
        description,
        application_deadline: applicationDeadline,
        visibility_status: visibilityStatus
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        setJobs([...jobs, response.data]);
        resetForm();
        setSnackbarMessage('Job posting created successfully');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Unexpected response status');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Failed to create job posting:', error);
      setSnackbarMessage('Failed to create job posting');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleToggle = () => {
    setViewMode(!viewMode);
  };

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5001/api/job-postings/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setJobs(jobs.filter(job => job._id !== jobId));
      setSnackbarMessage('Job posting deleted successfully');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Failed to delete job posting:', error);
      setSnackbarMessage('Failed to delete job posting');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:5001/api/job-postings/${selectedJob._id}`, {
        title: selectedJob.title,
        department: selectedJob.department,
        location: selectedJob.location,
        jobType: selectedJob.jobType,
        description: selectedJob.description,
        application_deadline: selectedJob.applicationDeadline,
        visibility_status: selectedJob.visibilityStatus
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setJobs(jobs.map(job => (job._id === response.data._id ? response.data : job)));
      setSnackbarMessage('Job posting updated successfully');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Failed to update job posting:', error);
      setSnackbarMessage('Failed to update job posting');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
    setDialogOpen(false);
  };

  const handleDialogOpen = (job) => {
    setSelectedJob(job);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedJob(null);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setSelectedJob(prevState => ({ ...prevState, [name]: value }));
  };

  const resetForm = () => {
    setTitle('');
    setDepartment('');
    setLocation('');
    setJobType('');
    setDescription('');
    setApplicationDeadline('');
    setVisibilityStatus(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h5">Job Postings</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={viewMode}
            onChange={handleToggle}
          />
        }
        label={viewMode ? 'Create Job Posting' : 'View Job Postings'}
      />
      {viewMode ? (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Job Type"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Application Deadline"
            type="date"
            value={applicationDeadline}
            onChange={(e) => setApplicationDeadline(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={visibilityStatus}
                onChange={(e) => setVisibilityStatus(e.target.checked)}
              />
            }
            label="Visibility Status"
          />
          <Button type="submit" variant="contained" color="primary">Create</Button>
        </form>
      ) : (
        <>
          <List>
            {jobs.map(job => (
              <ListItem key={job._id}>
                <ListItemText
                  primary={job.title}
                  secondary={`${job.department} | ${job.location} | ${job.jobType}`}
                />
                <IconButton onClick={() => handleDialogOpen(job)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(job._id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => handleDialogOpen(job)}>
                  <EditIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>{editMode ? 'Edit Job Posting' : 'View Job Posting'}</DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                name="title"
                value={selectedJob?.title || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Department"
                name="department"
                value={selectedJob?.department || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Location"
                name="location"
                value={selectedJob?.location || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Job Type"
                name="jobType"
                value={selectedJob?.jobType || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={selectedJob?.description || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                label="Application Deadline"
                name="applicationDeadline"
                type="date"
                value={selectedJob?.applicationDeadline || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="visibilityStatus"
                    checked={selectedJob?.visibilityStatus || false}
                    onChange={(e) => handleFieldChange(e)}
                  />
                }
                label="Visibility Status"
              />
            </DialogContent>
            <DialogActions>
              {editMode && <Button onClick={handleUpdate} color="primary">Save</Button>}
              <Button onClick={handleDialogClose} color="secondary">Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
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

export default JobPostingForm;
