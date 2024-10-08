# Recruitment-Tracker

This is the backend API for the Recruitment Management System, built using Flask. The backend provides endpoints for managing job applications, job postings, user authentication, and more. It uses MongoDB for data storage, Flask-JWT for authentication, and Flask-Mail for sending emails.

## Features

- **Job Postings**: Create, read, update, and delete job postings.
- **Candidate**: Data
- **Application Management**: Submit and view job applications.
- **User Authentication**: Register and login users, with role-based access control.
- **Email Notifications**: Send interview schedules to candidates via email.
- **Role base Access**: HR- Jobposting,Candidatelist, Rucruiter- Candidatelist 


## Technologies Used

- **Framework**: Flask
- **Database**: MongoDB
- **Authentication**: Flask-JWT-Extended
- **Email**: Flask-Mail
- **File Uploads**: Werkzeug
- **CORS**: Flask-CORS

## Prerequisites

- Python 3.x installed
- MongoDB server running on `localhost:27017`
- An email account for sending emails (configured in `MAIL_USERNAME` and `MAIL_PASSWORD`)

## Installation

To install the required Python packages, use the following command:

```bash
pip install -r requirements.txt

## Setup

1. **Clone the Repository**

## Note
IF The project may not be showing role-based access. Please reload the page once.
Recruiter role : -  Homepage, Candidate Data 
Hr role : - Job Posting , Homepage , Candidate Data 
normal user directly apply from home page they don't  have the login system for them 
#   r e c r u i t e r - t r a c k e r  
 