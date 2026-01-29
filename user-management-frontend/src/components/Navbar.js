import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2', marginBottom: 3 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontWeight: 600
            }}
            onClick={() => navigate('/users')}
          >
            User Management System
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;