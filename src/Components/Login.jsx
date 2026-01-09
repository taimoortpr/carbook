import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, Snackbar } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import loginimage from '../images/illustration.webp';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      // Redirect to the appropriate dashboard based on the role
      if (role === 'admin') {
        navigate(`/admin-dashboard/${localStorage.getItem('companyName')}`, { replace: true });
      } else if (role === 'superadmin') {
        navigate('/superadmin-dashboard', { replace: true });
      } else {
        navigate('/user-dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password,
      });

      const { token, role, adminId, companyName } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('adminid', adminId);
      localStorage.setItem('companyName', companyName); // Store company name in localStorage

      if (role === 'admin') {
        navigate(`/admin-dashboard/${companyName}`, { replace: true });
      } else if (role === 'superadmin') {
        navigate('/superadmin-dashboard', { replace: true });
      } else {
        navigate('/user-dashboard', { replace: true });
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        setError('Login request failed. Please try again.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xl" sx={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
      <Grid container sx={{ height: "100%" }}>
        {/* Left Column - Form */}
        <Grid item xs={12} md={7} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Box sx={{ width: "100%", maxWidth: "400px", padding: 3 }}>
            <Typography component="h1" variant="h5" align="center">Sign in to your account</Typography>
            <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 2 }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
              <Typography variant="body2" align="center">
                <Link to="/forgot-password" style={{ textDecoration: "none" }}>Forgot password?</Link>
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ textDecoration: "none" }}>Get started</Link>
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right Column - Heading and GIF */}
        <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#EFF1F3" }}>
          <Box sx={{ textAlign: "center", padding: 3, maxWidth: "80%" }}>
            <Typography variant="h4" gutterBottom>Welcome Back!</Typography>
            <img src={loginimage} alt="Animated" style={{ maxWidth: "100%", height: "auto" }} />
          </Box>
        </Grid>
      </Grid>

      {/* Error Snackbar */}
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError('')}
          message={error}
        />
      )}
    </Container>
  );
};

export default Login;
