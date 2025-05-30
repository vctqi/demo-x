import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  InputAdornment,
  CircularProgress
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import { getCnpjData } from '../../services/api';

// CNPJ mask function
const formatCnpj = (value) => {
  if (!value) return '';
  
  // Remove non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Apply mask XX.XXX.XXX/XXXX-XX
  return digits
    .replace(/^(\d{2})(\d)/g, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/g, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/g, '.$1/$2')
    .replace(/(\d{4})(\d)/g, '$1-$2')
    .substring(0, 18); // Max length with mask
};

const CnpjForm = ({ onResult, onLoading, onError }) => {
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleCnpjChange = (e) => {
    const formattedValue = formatCnpj(e.target.value);
    setCnpj(formattedValue);
    setValidationError('');
  };

  const validateCnpj = () => {
    // Remove mask for validation
    const digits = cnpj.replace(/\D/g, '');
    
    if (!digits) {
      setValidationError('CNPJ é obrigatório');
      return false;
    }
    
    if (digits.length !== 14) {
      setValidationError('CNPJ deve conter 14 dígitos');
      return false;
    }
    
    // Algorithm validation could be added here if needed
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCnpj()) {
      return;
    }
    
    setLoading(true);
    if (onLoading) onLoading(true);
    if (onError) onError(null);
    
    try {
      // Remove mask before sending to API
      const cleanCnpj = cnpj.replace(/\D/g, '');
      const data = await getCnpjData(cleanCnpj);
      
      if (onResult) onResult(data);
    } catch (error) {
      console.error('Error fetching CNPJ data:', error);
      const errorMessage = error.response?.data?.error?.message || 
                           'Erro ao consultar o CNPJ. Tente novamente mais tarde.';
      
      if (onError) onError(errorMessage);
    } finally {
      setLoading(false);
      if (onLoading) onLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <TextField
          fullWidth
          label="CNPJ da Empresa"
          value={cnpj}
          onChange={handleCnpjChange}
          placeholder="XX.XXX.XXX/XXXX-XX"
          margin="normal"
          variant="outlined"
          error={!!validationError}
          helperText={validationError}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BusinessIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mr: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
          sx={{ mt: 2, height: 56 }}
        >
          {loading ? 'Consultando...' : 'Analisar Risco'}
        </Button>
      </Box>
    </Box>
  );
};

export default CnpjForm;