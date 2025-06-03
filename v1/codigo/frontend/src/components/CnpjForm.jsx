import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert, 
  Snackbar 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppContext } from '../contexts/AppContext';
import cnpjService from '../services/cnpjService';
import { formatCnpjInput } from '../utils/cnpjFormatter';

/**
 * CNPJ input form component
 */
function CnpjForm() {
  const [cnpj, setCnpj] = useState('');
  const [isValidInput, setIsValidInput] = useState(true);
  const [inputError, setInputError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  
  const { 
    setCompanyData, 
    setRiskAnalysis, 
    loading, 
    setLoading, 
    error, 
    setError,
    sessionId,
    clearData,
  } = useAppContext();

  /**
   * Handles CNPJ input change
   */
  const handleCnpjChange = (event) => {
    const inputValue = event.target.value;
    const formattedValue = formatCnpjInput(inputValue);
    setCnpj(formattedValue);
    
    // Reset validation errors when input changes
    setIsValidInput(true);
    setInputError('');
  };

  /**
   * Validates the CNPJ input
   */
  const validateInput = () => {
    if (!cnpj.trim()) {
      setIsValidInput(false);
      setInputError('Por favor, informe um CNPJ.');
      return false;
    }
    
    // Basic format validation - check if we have close to 14 digits
    const digits = cnpj.replace(/[^\d]/g, '');
    if (digits.length !== 14) {
      setIsValidInput(false);
      setInputError('CNPJ deve conter 14 dígitos.');
      return false;
    }
    
    return true;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Clear previous data
    clearData();
    
    // Validate input
    if (!validateInput()) {
      return;
    }
    
    // Set loading state
    setLoading({ ...loading, companyData: true, riskAnalysis: true });
    
    try {
      // First, validate CNPJ format with backend
      const validationResult = await cnpjService.validateCnpj(cnpj);
      
      if (!validationResult.valid) {
        setIsValidInput(false);
        setInputError('CNPJ inválido. Verifique os dígitos informados.');
        setLoading({ ...loading, companyData: false, riskAnalysis: false });
        return;
      }
      
      // Fetch company data
      const companyData = await cnpjService.getCompanyInfo(validationResult.formatted);
      setCompanyData(companyData);
      setLoading({ ...loading, companyData: false });
      
      // Fetch risk analysis
      const riskData = await cnpjService.getRiskAnalysis(validationResult.formatted);
      setRiskAnalysis(riskData);
      setLoading({ ...loading, riskAnalysis: false });
      
      // Add to history
      await cnpjService.addToHistory(validationResult.formatted, sessionId);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Análise concluída com sucesso',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error in form submission:', err);
      
      // Set error state
      setError({
        ...error,
        companyData: err.response?.data?.message || 'Erro ao consultar CNPJ',
        riskAnalysis: err.response?.data?.message || 'Erro ao analisar risco',
      });
      
      // Show error message
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao processar a solicitação',
        severity: 'error',
      });
      
      // Reset loading state
      setLoading({ ...loading, companyData: false, riskAnalysis: false });
    }
  };

  /**
   * Closes the snackbar
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        Consulta de CNPJ
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <TextField
          fullWidth
          label="CNPJ da Empresa"
          variant="outlined"
          value={cnpj}
          onChange={handleCnpjChange}
          placeholder="00.000.000/0000-00"
          error={!isValidInput}
          helperText={inputError || 'Digite apenas os números ou com formatação'}
          disabled={loading.companyData}
          sx={{ mr: 2 }}
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading.companyData}
          startIcon={loading.companyData ? <CircularProgress size={20} /> : <SearchIcon />}
          sx={{ height: 56 }}
        >
          {loading.companyData ? 'Consultando...' : 'Analisar Risco'}
        </Button>
      </Box>
      
      {error.companyData && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error.companyData}
        </Alert>
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CnpjForm;