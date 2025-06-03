import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Chip,
  Button,
  CircularProgress
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { useAppContext } from '../contexts/AppContext';
import cnpjService from '../services/cnpjService';

/**
 * Component to display consultation history
 */
function HistoryPanel() {
  const { 
    history, 
    setHistory, 
    sessionId, 
    setCompanyData, 
    setRiskAnalysis, 
    setLoading, 
    setError 
  } = useAppContext();
  
  // Load history when component mounts or sessionId changes
  useEffect(() => {
    const loadHistory = async () => {
      if (sessionId) {
        try {
          const historyData = await cnpjService.getHistory(sessionId);
          setHistory(historyData);
        } catch (error) {
          console.error('Error loading history:', error);
        }
      }
    };
    
    loadHistory();
  }, [sessionId, setHistory]);
  
  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Handle click on a history item
  const handleHistoryItemClick = async (cnpj) => {
    // Reset error state
    setError({
      companyData: null,
      riskAnalysis: null,
    });
    
    // Set loading state
    setLoading({
      companyData: true,
      riskAnalysis: true,
    });
    
    try {
      // Fetch company data
      const companyData = await cnpjService.getCompanyInfo(cnpj);
      setCompanyData(companyData);
      
      // Fetch risk analysis
      const riskData = await cnpjService.getRiskAnalysis(cnpj);
      setRiskAnalysis(riskData);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching data from history:', error);
      setError({
        companyData: 'Erro ao carregar dados do histórico',
        riskAnalysis: 'Erro ao carregar análise do histórico',
      });
    } finally {
      // Reset loading state
      setLoading({
        companyData: false,
        riskAnalysis: false,
      });
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <HistoryIcon sx={{ mr: 1 }} />
        Histórico de Consultas
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      {history.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
          Nenhuma consulta realizada nesta sessão.
        </Typography>
      ) : (
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {history.map((item, index) => (
            <React.Fragment key={item.id || index}>
              <ListItem 
                button 
                onClick={() => handleHistoryItemClick(item.cnpj)}
                sx={{ 
                  borderRadius: 1,
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" noWrap>
                      {item.companyName || 'Empresa'}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="caption" color="text.secondary">
                        {item.cnpj}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(item.consultationDate)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < history.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" display="block">
          O histórico é mantido apenas durante esta sessão.
        </Typography>
      </Box>
    </Box>
  );
}

export default HistoryPanel;