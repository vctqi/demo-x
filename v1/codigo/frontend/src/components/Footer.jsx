import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

/**
 * Application footer component
 */
function Footer() {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[100] }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; {new Date().getFullYear()} Analisador de Risco de Cliente PJ
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <Link color="inherit" href="https://docs.cnpj.ws/">
            Powered by API CNPJ.ws
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;