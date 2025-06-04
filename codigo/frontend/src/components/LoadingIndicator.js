import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Componente de indicador de carregamento
 * @param {Object} props - Propriedades do componente
 * @param {string} props.message - Mensagem a ser exibida
 */
function LoadingIndicator({ message = 'Carregando...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
}

export default LoadingIndicator;