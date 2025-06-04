import React, { useState } from 'react';
import { Box, Grid, Button, Paper, Typography, Container } from '@mui/material';
import { useQuery } from 'react-query';

import CNPJInputForm from './CNPJInputForm';
import CompanyDetails from './CompanyDetails';
import RiskAnalysis from './RiskAnalysis';
import ErrorDisplay from './ErrorDisplay';
import LoadingIndicator from './LoadingIndicator';
import apiService from '../services/api';

/**
 * Componente da página principal
 */
function HomePage() {
  const [cnpj, setCnpj] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  
  // Consulta do CNPJ usando React Query
  const { 
    data: result, 
    isLoading, 
    isError, 
    refetch,
    remove
  } = useQuery(
    ['cnpj', cnpj],
    () => apiService.consultarCnpj(cnpj),
    {
      enabled: !!cnpj,
      retry: 1,
      onSuccess: () => {
        setShowResults(true);
        setError(null);
      },
      onError: (err) => {
        setError(err.message);
        setShowResults(false);
      }
    }
  );
  
  /**
   * Manipula o envio do formulário de CNPJ
   * @param {string} cnpjValue - CNPJ informado
   */
  const handleSubmitCnpj = (cnpjValue) => {
    setCnpj(cnpjValue);
  };
  
  /**
   * Inicia uma nova consulta
   */
  const handleNewConsult = () => {
    setShowResults(false);
    setCnpj(null);
    setError(null);
    remove();
  };
  
  /**
   * Tenta novamente a consulta atual
   */
  const handleRetry = () => {
    setError(null);
    refetch();
  };
  
  /**
   * Fecha a mensagem de erro
   */
  const handleDismissError = () => {
    setError(null);
  };
  
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={showResults ? 4 : 12}>
          <CNPJInputForm
            onSubmit={handleSubmitCnpj}
            isLoading={isLoading}
          />
          
          {error && (
            <ErrorDisplay
              message={error}
              onRetry={handleRetry}
              onDismiss={handleDismissError}
            />
          )}
          
          {showResults && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleNewConsult}
                fullWidth
              >
                Nova Consulta
              </Button>
            </Box>
          )}
        </Grid>
        
        {showResults && (
          <Grid item xs={12} md={8}>
            {isLoading ? (
              <Paper sx={{ p: 3, mt: { xs: 0, md: 0 } }}>
                <LoadingIndicator message="Analisando CNPJ..." />
              </Paper>
            ) : (
              <Box>
                {result?.data?.company && (
                  <CompanyDetails company={result.data.company} />
                )}
                
                {result?.data?.riskAnalysis && (
                  <RiskAnalysis riskAnalysis={result.data.riskAnalysis} />
                )}
              </Box>
            )}
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default HomePage;