import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Header from './components/Header';
import HomePage from './components/HomePage';

/**
 * Componente principal da aplicação
 */
function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Container>
      
      <Box 
        component="footer" 
        sx={{ 
          py: 2, 
          mt: 'auto', 
          textAlign: 'center',
          bgcolor: 'primary.main',
          color: 'white'
        }}
      >
        <Container>
          <Box sx={{ fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} Analisador de Risco de Cliente PJ via CNPJ
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default App;