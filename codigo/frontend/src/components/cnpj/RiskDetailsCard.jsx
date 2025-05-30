import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon,
  ListItemText, 
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const RiskDetailsCard = ({ riskData }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!riskData) return null;
  
  const {
    score,
    classificacao,
    criterios_positivos,
    criterios_negativos
  } = riskData;
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  return (
    <Card>
      <CardHeader
        title="Análise de Risco"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <Divider />
      <CardContent>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Score de Risco"
              secondary={`${score} pontos`}
              primaryTypographyProps={{ 
                variant: 'subtitle2', 
                color: 'text.secondary' 
              }}
              secondaryTypographyProps={{ 
                variant: 'body1',
                color: 'text.primary',
                fontWeight: 'bold'
              }}
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText
              primary="Classificação"
              secondary={classificacao}
              primaryTypographyProps={{ 
                variant: 'subtitle2', 
                color: 'text.secondary' 
              }}
              secondaryTypographyProps={{ 
                variant: 'body1',
                color: classificacao === 'Baixo' ? 'success.main' : 
                       classificacao === 'Médio' ? 'warning.main' : 'error.main',
                fontWeight: 'bold'
              }}
            />
          </ListItem>
        </List>
        
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Detalhamento dos Critérios
        </Typography>
        
        {/* Positive Criteria */}
        {criterios_positivos && criterios_positivos.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography>
                  Critérios Positivos ({criterios_positivos.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {criterios_positivos.map((criterio, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AddIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${criterio.criterio} (+${criterio.pontuacao})`}
                      secondary={criterio.descricao}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}
        
        {/* Negative Criteria */}
        {criterios_negativos && criterios_negativos.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CancelIcon color="error" sx={{ mr: 1 }} />
                <Typography>
                  Critérios Negativos ({criterios_negativos.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {criterios_negativos.map((criterio, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <RemoveIcon color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${criterio.criterio} (${criterio.pontuacao})`}
                      secondary={criterio.descricao}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.75rem' }}>
          A classificação de risco é baseada no score final:
          <br />
          • Baixo Risco: 20 pontos ou mais
          <br />
          • Médio Risco: Entre 0 e 19 pontos
          <br />
          • Alto Risco: Abaixo de 0 pontos
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RiskDetailsCard;