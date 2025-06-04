import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme } from '@mui/material';

/**
 * Componente de cabeçalho da aplicação
 */
function Header() {
  const theme = useTheme();
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1,
              fontWeight: 'bold',
              [theme.breakpoints.down('sm')]: {
                fontSize: '1rem',
              }
            }}
          >
            Analisador de Risco de Cliente PJ via CNPJ
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;