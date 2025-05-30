import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton, 
  Chip, 
  Divider, 
  Button,
  Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useHistory } from '../../contexts/HistoryContext';
import { getCnpjData } from '../../services/api';

// Format CNPJ to XX.XXX.XXX/XXXX-XX
const formatCnpj = (cnpj) => {
  if (!cnpj) return '';
  
  const digits = cnpj.replace(/\D/g, '');
  
  if (digits.length !== 14) return cnpj;
  
  return digits
    .replace(/^(\d{2})(\d)/g, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/g, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/g, '.$1/$2')
    .replace(/(\d{4})(\d)/g, '$1-$2');
};

// Format date string to dd/mm/yyyy HH:MM
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  } catch (error) {
    return dateString;
  }
};

const HistoryList = ({ onItemClick }) => {
  const { historyItems, clearHistory } = useHistory();
  
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
  
  const handleItemClick = async (cnpj) => {
    try {
      // Fetch the latest data
      const data = await getCnpjData(cnpj);
      if (onItemClick) onItemClick(data);
    } catch (error) {
      console.error('Error fetching CNPJ data from history:', error);
      // You could handle the error here, or just pass it to the parent
      if (onItemClick) onItemClick(null, error.message);
    }
  };
  
  if (!historyItems || historyItems.length === 0) {
    return (
      <Alert severity="info">
        Nenhuma consulta realizada ainda. Insira um CNPJ para ver o histórico.
      </Alert>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Histórico de Consultas
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<DeleteIcon />}
          onClick={clearHistory}
        >
          Limpar Histórico
        </Button>
      </Box>
      
      <List>
        {historyItems.map((item, index) => (
          <React.Fragment key={item.cnpj}>
            <ListItem>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" component="span">
                      {item.razao_social}
                    </Typography>
                    <Chip
                      label={`Risco ${item.classificacao}`}
                      color={getRiskColor(item.classificacao)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {formatCnpj(item.cnpj)}
                    </Typography>
                    {' — '}
                    {formatDate(item.data_consulta)}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  onClick={() => handleItemClick(item.cnpj)}
                  title="Ver detalhes"
                >
                  <VisibilityIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {index < historyItems.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default HistoryList;