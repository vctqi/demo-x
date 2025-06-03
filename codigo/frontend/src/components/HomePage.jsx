import React, { useEffect } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import CnpjForm from './CnpjForm';
import RiskDashboard from './RiskDashboard';
import CompanyInfo from './CompanyInfo';
import HistoryPanel from './HistoryPanel';
import { useAppContext } from '../contexts/AppContext';
import cnpjService from '../services/cnpjService';

/**
 * Home page component
 */
function HomePage() {
  const { 
    companyData, 
    riskAnalysis, 
    sessionId,
    setHistory,
  } = useAppContext();

  // Load history on component mount
  useEffect(() => {
    const loadHistory = async () => {
      if (sessionId) {
        try {
          const historyData = await cnpjService.getHistory(sessionId);
          setHistory(historyData);
        } catch (error) {
          console.error('Error loading history:', error);
        }
      }
    };

    loadHistory();
  }, [sessionId, setHistory]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Analisador de Risco de Cliente PJ via CNPJ
      </Typography>
      
      <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
        Insira o CNPJ de uma empresa para obter uma análise simplificada de risco baseada em dados públicos.
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <CnpjForm />
          </Paper>
          
          {companyData && (
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <CompanyInfo />
            </Paper>
          )}
          
          {riskAnalysis && (
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <RiskDashboard />
            </Paper>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <HistoryPanel />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;