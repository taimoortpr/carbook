import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  BookOnline as BookOnlineIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  People as PeopleIcon,
  RocketLaunch as RocketLaunchIcon, // For the banner image/icon
} from '@mui/icons-material';

// Assume these counts would come from an API endpoint (e.g., /api/admin/dashboard-stats)
const adminStats = [
  { title: 'Total Bookings', value: '458', icon: <BookOnlineIcon />, color: '#007BFF', change: '+12.5%' },
  { title: 'Active Products', value: '75', icon: <ShoppingCartIcon />, color: '#ff9800', change: '+5.1%' },
  { title: 'Pending Tasks', value: '12', icon: <PeopleIcon />, color: '#f44336', change: '-1.2%' },
  { title: 'Total Revenue', value: '$8,450', icon: <AttachMoneyIcon />, color: '#4caf50', change: '+18.0%' },
];

const userStats = [
    { title: 'My Bookings', value: '5', icon: <BookOnlineIcon />, color: '#007BFF', change: 'Confirmed: 3' },
    { title: 'Products Viewed', value: '45', icon: <ShoppingCartIcon />, color: '#ff9800', change: 'New Today: 2' },
    { title: 'Map Locations', value: '12', icon: <MapIcon />, color: '#4caf50', change: 'Favorite: 5' },
];

// Reusable component for the metric cards
const MetricCard = ({ title, value, icon, color, change }) => (
  <Card sx={{ height: '100%', borderLeft: `4px solid ${color}`, transition: 'box-shadow 0.3s' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Box sx={{ color: color }}>{icon}</Box>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 700, mt: 1, color: 'text.primary' }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: color, fontWeight: 600 }}>
        {change}
      </Typography>
    </CardContent>
  </Card>
);

const DashboardHome = ({ role = 'admin', companyName = 'Your Company' }) => {
  const theme = useTheme();
  const stats = role === 'admin' ? adminStats : userStats;

  // Placeholder for data fetching state
  const [loading, setLoading] = useState(false); 

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  return (
    <Box>
      {/* 1. Welcome Banner (Matches Able Pro design) */}
      <Paper 
        sx={{
          p: 4,
          mb: 4,
          bgcolor: theme.palette.primary.main, // Primary Blue background
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: theme.shape.borderRadius,
          // Custom gradient for a modern feel
          background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
        }}
        elevation={4}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Hello, Welcome to {companyName}'s Dashboard! 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {role === 'admin' 
                ? 'Review key operational metrics, manage product inventory, and track all user bookings.' 
                : 'View your booking history, track products you are interested in, and manage your profile details.'
              }
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                mt: 3, 
                bgcolor: 'white', 
                color: theme.palette.primary.main, 
                fontWeight: 600,
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
              onClick={() => console.log('Navigate to a help page or quick action')}
            >
              Quick Start Guide
            </Button>
          </Grid>
          <Grid 
            item 
            md={3} 
            sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                justifyContent: 'flex-end', 
                alignItems: 'center' 
            }}
          >
            {/* Simple rocket icon similar to the Able Pro design */}
            <RocketLaunchIcon sx={{ fontSize: '6rem', opacity: 0.8 }} />
          </Grid>
        </Grid>
      </Paper>

      {/* 2. Metric Cards (KPIs) */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
        {role === 'admin' ? 'Administrative Overview' : 'Your Activity Summary'}
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <MetricCard {...stat} />
          </Grid>
        ))}
      </Grid>
      
      {/* 3. Placeholder for Charts/Recent Activity */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>Recent Bookings/Orders</Typography>
            {/* You would replace this with a list of recent items or a line chart */}
            <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                <Typography>Placeholder for Recent Activity List or Map Box</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>Quick Stats/Traffic</Typography>
            {/* You would replace this with a small pie chart or quick link buttons */}
            <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                <Typography>Placeholder for a simple chart or quick actions.</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;