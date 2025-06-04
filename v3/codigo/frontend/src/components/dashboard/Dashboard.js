import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { cnpjService } from '../../services/api';
import Header from '../common/Header';
import CNPJForm from '../forms/CNPJForm';
import ResultsPanel from './ResultsPanel';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const DashboardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyzeRisk = async (cnpj) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cnpjService.analyzeRisk(cnpj);
      
      if (response.success) {
        setAnalysisResult(response.data);
        toast.success('Análise de risco concluída com sucesso!');
      } else {
        throw new Error(response.message || 'Erro ao analisar risco');
      }
    } catch (err) {
      console.error('Erro ao analisar risco:', err);
      
      const errorMessage = err.response?.data?.message || err.message || 'Ocorreu um erro ao analisar o risco';
      
      setError({
        message: errorMessage,
        suggestions: getSuggestions(err)
      });
      
      toast.error(errorMessage);
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = (error) => {
    const suggestions = [];
    const errorMessage = error.response?.data?.message || error.message || '';
    
    if (errorMessage.includes('CNPJ inválido')) {
      suggestions.push('Verifique se o CNPJ foi digitado corretamente');
      suggestions.push('O CNPJ deve conter 14 dígitos numéricos');
    } else if (errorMessage.includes('não encontrado')) {
      suggestions.push('Verifique se o CNPJ foi digitado corretamente');
      suggestions.push('O CNPJ pode não estar registrado na base de dados');
    } else if (errorMessage.includes('indisponível')) {
      suggestions.push('Tente novamente mais tarde');
      suggestions.push('Verifique sua conexão com a internet');
    } else {
      suggestions.push('Tente novamente mais tarde');
      suggestions.push('Entre em contato com o suporte se o problema persistir');
    }
    
    return suggestions;
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <div>
      <Header 
        title="Analisador de Risco de Cliente PJ via CNPJ" 
        subtitle="Análise simplificada baseada em dados públicos"
      />
      
      <DashboardContainer>
        <CNPJForm onSubmit={handleAnalyzeRisk} loading={loading} />
        
        {loading && (
          <Loader message="Analisando CNPJ, por favor aguarde..." />
        )}
        
        {error && !loading && (
          <ErrorMessage 
            title="Erro na análise" 
            message={error.message}
            suggestions={error.suggestions}
            onRetry={handleRetry}
          />
        )}
        
        {!loading && !error && (
          <ResultsPanel analysisResult={analysisResult} />
        )}
      </DashboardContainer>
    </div>
  );
};

export default Dashboard;