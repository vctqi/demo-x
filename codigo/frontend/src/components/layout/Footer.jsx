import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Analisador de Risco de Cliente PJ - '}
          <Link color="inherit" href="#">
            Termos de Uso
          </Link>
          {' | '}
          <Link color="inherit" href="#">
            Política de Privacidade
          </Link>
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 1 }}>
          Esta ferramenta utiliza apenas dados públicos e tem caráter informativo. Não substitui análises completas de due diligence.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;