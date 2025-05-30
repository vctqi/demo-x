import React, { useState } from 'react';
import { Box, Typography, Paper, Tab, Tabs, Divider } from '@mui/material';
import CnpjForm from '../components/cnpj/CnpjForm';
import CnpjResult from '../components/cnpj/CnpjResult';
import HistoryList from '../components/history/HistoryList';
import { useHistory } from '../contexts/HistoryContext';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [cnpjData, setCnpjData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToHistory } = useHistory();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCnpjResult = (data) => {
    setCnpjData(data);
    
    // Add to history
    addToHistory({
      cnpj: data.cnpj,
      razao_social: data.razao_social,
      data_consulta: new Date().toISOString(),
      classificacao: data.risco.classificacao
    });
  };

  const handleHistoryItemClick = (data) => {
    setCnpjData(data);
    setActiveTab(0); // Switch to result tab
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analisador de Risco via CNPJ
        </Typography>
        <Typography variant="body1" paragraph>
          Insira o CNPJ de uma empresa para obter uma análise simplificada de risco com base em dados públicos.
        </Typography>
        
        <CnpjForm 
          onResult={handleCnpjResult} 
          onLoading={setLoading}
          onError={setError}
        />
      </Paper>

      {(cnpjData || error) && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Resultado" />
              <Tab label="Histórico" />
            </Tabs>
          </Box>
          
          <Box role="tabpanel" hidden={activeTab !== 0}>
            {activeTab === 0 && (
              <CnpjResult 
                data={cnpjData} 
                loading={loading} 
                error={error}
              />
            )}
          </Box>
          
          <Box role="tabpanel" hidden={activeTab !== 1}>
            {activeTab === 1 && (
              <HistoryList onItemClick={handleHistoryItemClick} />
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default HomePage;