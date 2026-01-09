import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet, Link, useParams, useNavigate } from 'react-router-dom';
import avatar from '../images/avatar.jpg';

const drawerWidth = 240;

const AdminDashboard = () => {
  const { companyName } = useParams(); // Get companyName from URL parameters
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    // Prevent the user from going back to the login page using the browser back button
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1); // Prevent back navigation
    };
  }, []);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
    const handleLogout = () => {
      // Remove token and role from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('adminid'); // If needed
      localStorage.removeItem('companyName'); // If needed
  
     
    };
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
          ml: drawerOpen ? `${drawerWidth}px` : 0,
          transition: 'width 0.3s, margin-left 0.3s',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton edge="end" color="inherit" onClick={handleAvatarClick}>
            <Avatar alt="Admin" src={avatar} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link to="/login" onClick={handleLogout} style={{ textDecoration: 'none', color: 'inherit' }}>
                <IconButton color="inherit">
                  <LogoutIcon />
                </IconButton>
                Logout
              </Link>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? drawerWidth : 56,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerOpen ? drawerWidth : 56,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={Link} to={`/admin-dashboard/${companyName}`} sx={{ px: 2 }}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Dashboard Home" />}
            </ListItem>
            <ListItem button component={Link} to={`/admin-dashboard/${companyName}/add-products`} sx={{ px: 2 }}>
              <ListItemIcon>
                <AddBoxIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Add Products" />}
            </ListItem>
            <ListItem button component={Link} to={`/admin-dashboard/${companyName}/user-products`} sx={{ px: 2 }}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Show Products" />}
            </ListItem>
            <ListItem button component={Link} to={`/admin-dashboard/${companyName}/user-booking`} sx={{ px: 2 }}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="User Bookings" />}
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Adds space between AppBar and content */}
        <Outlet /> {/* Renders the nested route's component */}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
