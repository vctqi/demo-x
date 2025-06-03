import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

/**
 * Application header component
 */
function Header() {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <AssessmentIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Analisador de Risco de Cliente PJ
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;