import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress, 
  Divider, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip,
  LinearProgress
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InfoIcon from '@mui/icons-material/Info';
import { useAppContext } from '../contexts/AppContext';

/**
 * Component to display the risk analysis dashboard
 */
function RiskDashboard() {
  const { riskAnalysis, loading } = useAppContext();
  
  if (loading.riskAnalysis) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Analisando risco...
        </Typography>
      </Box>
    );
  }
  
  if (!riskAnalysis) {
    return null;
  }
  
  // Get color for risk level
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Baixo':
        return 'success.main';
      case 'Médio':
        return 'warning.main';
      case 'Alto':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };
  
  // Get score percentage (0-100)
  const getScorePercentage = (score) => {
    // Assume max score is 30 and min is -30
    const normalizedScore = Math.max(-30, Math.min(30, score)) + 30;
    return (normalizedScore / 60) * 100;
  };
  
  // Format the analysis date
  const formatDate = (dateString) => {
    if (!dateString) return 'Não disponível';
    
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <AssessmentIcon sx={{ mr: 1 }} />
        Análise de Risco
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Classificação de Risco
            </Typography>
            
            <Typography 
              variant="h3" 
              sx={{ 
                color: getRiskColor(riskAnalysis.riskLevel),
                fontWeight: 'bold',
                mb: 1
              }}
            >
              {riskAnalysis.riskLevel}
            </Typography>
            
            <Box sx={{ px: 5, mb: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={getScorePercentage(riskAnalysis.score)}
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: 'error.light',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getRiskColor(riskAnalysis.riskLevel),
                  }
                }}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Score: {riskAnalysis.score} pontos
            </Typography>
            
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Análise realizada em {formatDate(riskAnalysis.analysisDate)}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              O que esta classificação significa:
            </Typography>
            
            {riskAnalysis.riskLevel === 'Baixo' && (
              <Typography variant="body2" paragraph>
                Empresa com perfil de baixo risco, atendendo critérios importantes como situação regular, 
                tempo de operação significativo e atividade econômica de menor risco.
              </Typography>
            )}
            
            {riskAnalysis.riskLevel === 'Médio' && (
              <Typography variant="body2" paragraph>
                Empresa com alguns pontos de atenção que devem ser verificados mais detalhadamente.
                Esta classificação geralmente indica uma combinação de fatores positivos e negativos.
              </Typography>
            )}
            
            {riskAnalysis.riskLevel === 'Alto' && (
              <Typography variant="body2" paragraph>
                Empresa com fatores significativos de risco que merecem atenção especial.
                Recomenda-se uma avaliação mais aprofundada antes de estabelecer relações comerciais.
              </Typography>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Fatores que impactaram a análise:
          </Typography>
          
          <List>
            {riskAnalysis.scoreFactors.map((factor, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {factor.impact > 0 ? (
                    <TrendingUpIcon color="success" fontSize="small" />
                  ) : (
                    <TrendingDownIcon color="error" fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={factor.factor}
                  secondary={factor.description}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: factor.impact > 0 ? 'success.main' : 'error.main'
                  }}
                >
                  {factor.impact > 0 ? '+' : ''}{factor.impact}
                </Typography>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Esta é uma análise preliminar baseada em dados públicos e não substitui 
              uma avaliação completa de risco.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RiskDashboard;