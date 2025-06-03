import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';

/**
 * Main App component
 */
function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Container>
      <Footer />
    </Box>
  );
}

export default App;