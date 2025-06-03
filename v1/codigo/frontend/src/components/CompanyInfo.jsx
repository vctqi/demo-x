import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Chip, 
  Divider, 
  Skeleton, 
  CircularProgress 
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CategoryIcon from '@mui/icons-material/Category';
import InfoIcon from '@mui/icons-material/Info';
import { useAppContext } from '../contexts/AppContext';

/**
 * Component to display company information
 */
function CompanyInfo() {
  const { companyData, loading } = useAppContext();
  
  // Calculates the company's age
  const calculateAge = (openingDate) => {
    if (!openingDate) return 'Não disponível';
    
    const start = new Date(openingDate);
    const now = new Date();
    const ageInYears = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
    
    if (ageInYears < 1) {
      const ageInMonths = Math.floor(ageInYears * 12);
      return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
    }
    
    const years = Math.floor(ageInYears);
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  };
  
  // Determines the status color
  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'ativa') return 'success';
    if (statusLower === 'suspensa' || statusLower === 'inapta') return 'error';
    return 'default';
  };
  
  // Formats the opening date
  const formatDate = (dateString) => {
    if (!dateString) return 'Não disponível';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  if (loading.companyData) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando dados da empresa...
        </Typography>
      </Box>
    );
  }
  
  if (!companyData) {
    return null;
  }
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <BusinessIcon sx={{ mr: 1 }} />
        Dados da Empresa
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            {companyData.companyName || <Skeleton width="60%" />}
          </Typography>
          
          {companyData.tradeName && (
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Nome Fantasia: {companyData.tradeName}
            </Typography>
          )}
          
          <Typography variant="body2" gutterBottom>
            CNPJ: {companyData.cnpj || <Skeleton width={150} />}
          </Typography>
          
          <Box sx={{ mt: 1, mb: 2 }}>
            <Chip 
              label={companyData.status || 'Não disponível'} 
              color={getStatusColor(companyData.status || '')}
              size="small"
              sx={{ mr: 1 }}
            />
            
            {companyData.size && (
              <Chip 
                label={companyData.size} 
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DateRangeIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Data de Abertura
            </Typography>
          </Box>
          <Typography variant="body1" gutterBottom>
            {formatDate(companyData.openingDate)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tempo de operação: {calculateAge(companyData.openingDate)}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Localização
            </Typography>
          </Box>
          <Typography variant="body1" gutterBottom>
            {companyData.city ? `${companyData.city} - ${companyData.state}` : 'Não disponível'}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Atividade Principal
            </Typography>
          </Box>
          <Typography variant="body1" gutterBottom>
            {companyData.cnae ? `${companyData.cnae} - ${companyData.cnaeDescription}` : 'Não disponível'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CompanyInfo;