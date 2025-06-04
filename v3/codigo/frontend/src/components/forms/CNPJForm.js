import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { formatCNPJ, unformatCNPJ } from '../../utils/formatter';
import { validateCNPJ } from '../../utils/validator';
import Button from '../common/Button';
import Card from '../common/Card';

const FormContainer = styled.form`
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
  
  ${({ isValid, isDirty }) => {
    if (isDirty) {
      return isValid
        ? 'border-color: #2ecc71;'
        : 'border-color: #e74c3c;';
    }
    return '';
  }}
`;

const ErrorText = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  display: block;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const CNPJForm = ({ onSubmit, loading = false }) => {
  const [cnpj, setCnpj] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Valida o CNPJ sempre que ele mudar
  useEffect(() => {
    if (cnpj) {
      const unformattedCNPJ = unformatCNPJ(cnpj);
      const valid = validateCNPJ(unformattedCNPJ);
      
      setIsValid(valid);
      
      if (!valid && isDirty) {
        if (unformattedCNPJ.length !== 14) {
          setErrorMessage('O CNPJ deve conter 14 dígitos');
        } else {
          setErrorMessage('CNPJ inválido');
        }
      } else {
        setErrorMessage('');
      }
    } else {
      setIsValid(false);
      setErrorMessage(isDirty ? 'O CNPJ é obrigatório' : '');
    }
  }, [cnpj, isDirty]);

  const handleChange = (e) => {
    const value = e.target.value;
    
    // Limita a entrada a 18 caracteres (tamanho máximo do CNPJ formatado)
    if (value.length <= 18) {
      setCnpj(value);
      
      if (!isDirty) {
        setIsDirty(true);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!cnpj) {
      setIsDirty(true);
      setErrorMessage('O CNPJ é obrigatório');
      return;
    }
    
    if (!isValid) {
      toast.error('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }
    
    const unformattedCNPJ = unformatCNPJ(cnpj);
    onSubmit(unformattedCNPJ);
  };

  const handleClear = () => {
    setCnpj('');
    setIsDirty(false);
    setErrorMessage('');
  };

  const formatCNPJInput = () => {
    if (cnpj) {
      const unformattedCNPJ = unformatCNPJ(cnpj);
      setCnpj(formatCNPJ(unformattedCNPJ));
    }
  };

  return (
    <Card title="Consulta de CNPJ">
      <FormContainer onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            type="text"
            placeholder="Digite o CNPJ (ex: 00.000.000/0000-00)"
            value={cnpj}
            onChange={handleChange}
            onBlur={formatCNPJInput}
            isValid={isValid}
            isDirty={isDirty}
            disabled={loading}
          />
          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        </InputGroup>
        
        <ButtonsContainer>
          <Button 
            type="submit" 
            disabled={loading || !isValid} 
            fullWidth
          >
            {loading ? 'Analisando...' : 'Analisar Risco'}
          </Button>
          
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleClear}
            disabled={loading || !cnpj}
          >
            Limpar
          </Button>
        </ButtonsContainer>
      </FormContainer>
    </Card>
  );
};

export default CNPJForm;