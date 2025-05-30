import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Chip, 
  Divider, 
  Alert, 
  AlertTitle, 
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CompanyDataCard from './CompanyDataCard';
import RiskDetailsCard from './RiskDetailsCard';
import { exportPdf } from '../../services/api';

const CnpjResult = ({ data, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Erro</AlertTitle>
        {error}
      </Alert>
    );
  }
  
  if (!data) {
    return null;
  }

  const { risco } = data;
  
  // Determine color based on risk classification
  const getRiskColor = (classification) => {
    switch (classification) {
      case 'Baixo':
        return 'success';
      case 'Médio':
        return 'warning';
      case 'Alto':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleExportPdf = () => {
    exportPdf(data.cnpj);
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Resultado da Análise
          </Typography>
          <Chip
            label={`Risco ${risco.classificacao}`}
            color={getRiskColor(risco.classificacao)}
            size="large"
            sx={{ fontWeight: 'bold', fontSize: '1rem' }}
          />
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<PictureAsPdfIcon />}
          onClick={handleExportPdf}
        >
          Exportar PDF
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Company Data */}
        <Grid item xs={12} md={6}>
          <CompanyDataCard data={data} />
        </Grid>
        
        {/* Risk Details */}
        <Grid item xs={12} md={6}>
          <RiskDetailsCard riskData={risco} />
        </Grid>
      </Grid>
      
      {/* Alerts Section */}
      {risco.alertas && risco.alertas.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="warning">
            <AlertTitle>Sinais de Alerta Identificados</AlertTitle>
            <List dense>
              {risco.alertas.map((alerta, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={alerta} />
                </ListItem>
              ))}
            </List>
          </Alert>
        </Box>
      )}
      
      <Box sx={{ mt: 4, fontSize: '0.875rem', color: 'text.secondary' }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="caption" display="block">
          * Esta análise tem caráter informativo e baseia-se em dados públicos. Não substitui uma avaliação completa de due diligence.
        </Typography>
      </Box>
    </Box>
  );
};

export default CnpjResult;