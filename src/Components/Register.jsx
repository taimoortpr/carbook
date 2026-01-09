import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, Snackbar } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import loginimage from '../images/illustration.webp';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/check-status', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.loggedIn) {
          setIsLoggedIn(true);
          navigate('/login'); // Redirect to dashboard or another appropriate page
        }
      } catch (err) {
        console.error('Error checking login status', err);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Password validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register', {
        firstName,
        lastName,
        companyName,
        email,
        password,
        role: 'admin',
      });
  
      console.log('User registered successfully', response.data);
      alert('Registration successful! Please login.');
      navigate('/login',{replace: true});
    } catch (err) {
      // Capture the error message returned from the server
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Set the specific error message from the backend
      } else {
        setError('Registration failed. Please try again.'); // Default error message
      }
    }
  };
  
  

  if (isLoggedIn) return null; // Optionally render nothing while redirecting

  return (
    <Container component="main" maxWidth="xl" sx={{ height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Grid container sx={{ height: '100%' }}>
        {/* Left Column - Heading and Image */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#EFF1F3'
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              padding: 3,
              maxWidth: '80%'
            }}
          >
            <Typography variant="h4" gutterBottom>
              Join Us Today!
            </Typography>
            <img src={loginimage} alt="Illustration" style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
        </Grid>

        {/* Right Column - Form */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '400px',
              padding: 3
            }}
          >
            <Typography component="h1" variant="h5" align="center">
              Register
            </Typography>
            <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 2 }}>
              {/* Two-Column Layout: Row 1 */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoFocus
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Grid>
              </Grid>

              {/* Two-Column Layout: Row 2 */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="companyName"
                    label="Company Name"
                    name="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
              </Grid>

              {/* Password Fields */}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                Register
              </Button>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  Login Now
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Error Snackbar */}
      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')} message={error} />
      )}
      {/* Error Message Display */}
{error && (
  <Typography variant="body2" color="error" align="center">
    {error}
  </Typography>
)}
    </Container>
  );
};

export default Register;
