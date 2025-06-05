import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';
import cnpjUtils from '../utils/cnpjUtils';

/**
 * Componente de formulário para entrada de CNPJ
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onSubmit - Função chamada ao submeter o formulário
 * @param {boolean} props.isLoading - Flag indicando se está carregando
 */
function CNPJInputForm({ onSubmit, isLoading }) {
  const [cnpj, setCnpj] = useState('');
  const [error, setError] = useState('');
  
  /**
   * Manipula a mudança no campo de CNPJ
   * @param {Object} event - Evento de mudança
   */
  const handleChange = (event) => {
    const value = event.target.value;
    
    // Remover formatação ao digitar
    const cnpjLimpo = value.replace(/[^\d]/g, '');
    
    // Aplicar formatação visual
    if (cnpjLimpo.length <= 14) {
      let formatted = cnpjLimpo;
      
      if (cnpjLimpo.length > 2) {
        formatted = cnpjLimpo.replace(/^(\d{2})/, '$1.');
      }
      if (cnpjLimpo.length > 5) {
        formatted = cnpjLimpo.replace(/^(\d{2})(\d{3})/, '$1.$2.');
      }
      if (cnpjLimpo.length > 8) {
        formatted = cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})/, '$1.$2.$3/');
      }
      if (cnpjLimpo.length > 12) {
        formatted = cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4-');
      }
      
      setCnpj(formatted);
      
      // Limpar erro se o campo estiver vazio
      if (cnpjLimpo === '') {
        setError('');
      }
    }
  };
  
  /**
   * Manipula o envio do formulário
   * @param {Object} event - Evento de submit
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Remover formatação
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    
    // Validar CNPJ
    if (!cnpjLimpo) {
      setError('Por favor, informe um CNPJ.');
      return;
    }
    
    if (cnpjLimpo.length !== 14) {
      setError('CNPJ deve conter 14 dígitos.');
      return;
    }
    
    if (!cnpjUtils.validarCnpj(cnpjLimpo)) {
      setError('CNPJ inválido. Verifique os dígitos informados.');
      return;
    }
    
    // Limpar erro e chamar função de submit
    setError('');
    onSubmit(cnpjLimpo);
  };
  
  /**
   * Limpa o formulário
   */
  const handleClear = () => {
    setCnpj('');
    setError('');
  };
  
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Consulta de CNPJ
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Insira o CNPJ da empresa para análise de risco.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="CNPJ"
            variant="outlined"
            value={cnpj}
            onChange={handleChange}
            error={!!error}
            helperText={error}
            placeholder="00.000.000/0000-00"
            disabled={isLoading}
            margin="normal"
            InputProps={{
              endAdornment: cnpj ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="limpar campo"
                    onClick={handleClear}
                    edge="end"
                  >
                    ✕
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading || !cnpj}
            >
              {isLoading ? 'Analisando...' : 'Analisar Risco'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CNPJInputForm;