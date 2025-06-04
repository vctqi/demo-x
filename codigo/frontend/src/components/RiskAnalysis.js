import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider, 
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton
} from '@mui/material';

/**
 * Componente para exibição da análise de risco
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.riskAnalysis - Dados da análise de risco
 * @param {boolean} props.isLoading - Flag indicando se está carregando
 */
function RiskAnalysis({ riskAnalysis, isLoading }) {
  // Se estiver carregando, exibir skeleton
  if (isLoading) {
    return (
      <Card elevation={3} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            <Skeleton width="60%" />
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 4 }} />
          </Box>
          
          <Typography variant="h6" gutterBottom>
            <Skeleton width="40%" />
          </Typography>
          
          <List>
            {[...Array(3)].map((_, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Skeleton variant="circular" width={24} height={24} />
                </ListItemIcon>
                <ListItemText primary={<Skeleton width="90%" />} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }
  
  // Se não houver dados de análise, não renderizar nada
  if (!riskAnalysis) {
    return null;
  }
  
  // Definir cor do badge com base no nível de risco
  const getBadgeColor = (riskLevel) => {
    switch(riskLevel) {
      case 'BAIXO':
        return 'success';
      case 'MÉDIO':
        return 'warning';
      case 'ALTO':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Obter texto para o nível de risco
  const getRiskLabel = (riskLevel) => {
    switch(riskLevel) {
      case 'BAIXO':
        return 'BAIXO RISCO';
      case 'MÉDIO':
        return 'MÉDIO RISCO';
      case 'ALTO':
        return 'ALTO RISCO';
      default:
        return 'INDEFINIDO';
    }
  };
  
  return (
    <Card elevation={3} sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Análise de Risco
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Chip
            label={getRiskLabel(riskAnalysis.riskLevel)}
            color={getBadgeColor(riskAnalysis.riskLevel)}
            sx={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold', 
              py: 2.5, 
              px: 1
            }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Fatores Positivos
          </Typography>
          
          {riskAnalysis.factors && riskAnalysis.factors.positive && riskAnalysis.factors.positive.length > 0 ? (
            <List dense>
              {riskAnalysis.factors.positive.map((factor, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Box 
                      sx={{ 
                        color: 'success.main', 
                        fontSize: '1.2rem', 
                        fontWeight: 'bold' 
                      }}
                    >
                      +
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={factor} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Nenhum fator positivo identificado.
            </Typography>
          )}
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Fatores Negativos
          </Typography>
          
          {riskAnalysis.factors && riskAnalysis.factors.negative && riskAnalysis.factors.negative.length > 0 ? (
            <List dense>
              {riskAnalysis.factors.negative.map((factor, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Box 
                      sx={{ 
                        color: 'error.main', 
                        fontSize: '1.2rem', 
                        fontWeight: 'bold' 
                      }}
                    >
                      -
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={factor} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Nenhum fator negativo identificado.
            </Typography>
          )}
        </Box>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Score final: {riskAnalysis.score} pontos
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default RiskAnalysis;