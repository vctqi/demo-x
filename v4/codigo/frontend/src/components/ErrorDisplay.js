import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';

/**
 * Componente para exibição de erros
 * @param {Object} props - Propriedades do componente
 * @param {string} props.message - Mensagem de erro
 * @param {Function} props.onRetry - Função chamada ao clicar em tentar novamente
 * @param {Function} props.onDismiss - Função chamada ao clicar em fechar
 */
function ErrorDisplay({ message, onRetry, onDismiss }) {
  return (
    <Box sx={{ my: 3 }}>
      <Alert 
        severity="error" 
        variant="filled"
        action={
          <Box>
            {onRetry && (
              <Button 
                color="inherit" 
                size="small" 
                onClick={onRetry}
                sx={{ mr: 1 }}
              >
                Tentar Novamente
              </Button>
            )}
            {onDismiss && (
              <Button 
                color="inherit" 
                size="small" 
                onClick={onDismiss}
              >
                Fechar
              </Button>
            )}
          </Box>
        }
      >
        <AlertTitle>Erro</AlertTitle>
        {message || 'Ocorreu um erro inesperado. Por favor, tente novamente.'}
      </Alert>
    </Box>
  );
}

export default ErrorDisplay;