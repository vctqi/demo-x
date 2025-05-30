import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider 
} from '@mui/material';

// Format date string to dd/mm/yyyy
const formatDate = (dateString) => {
  if (!dateString) return 'Não informado';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return dateString;
  }
};

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

const CompanyDataCard = ({ data }) => {
  if (!data) return null;
  
  const {
    cnpj,
    razao_social,
    nome_fantasia,
    data_abertura,
    cnae_principal,
    situacao,
    porte,
    localizacao
  } = data;
  
  // Calculate operation time
  const calculateOperationTime = () => {
    if (!data_abertura) return 'Não disponível';
    
    try {
      const foundationDate = new Date(data_abertura);
      const currentDate = new Date();
      
      const diffTime = Math.abs(currentDate - foundationDate);
      const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
      const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
      
      return `${diffYears} ${diffYears === 1 ? 'ano' : 'anos'} e ${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`;
    } catch (error) {
      return 'Não disponível';
    }
  };
  
  const dataItems = [
    { label: 'CNPJ', value: formatCnpj(cnpj) },
    { label: 'Razão Social', value: razao_social || 'Não informado' },
    { label: 'Nome Fantasia', value: nome_fantasia || 'Não informado' },
    { label: 'Data de Abertura', value: formatDate(data_abertura) },
    { label: 'Tempo de Operação', value: calculateOperationTime() },
    { label: 'CNAE Principal', value: cnae_principal || 'Não informado' },
    { label: 'Situação Cadastral', value: situacao || 'Não informado' },
    { label: 'Porte da Empresa', value: porte || 'Não informado' },
    { label: 'Localização', value: localizacao || 'Não informado' }
  ];
  
  return (
    <Card>
      <CardHeader
        title="Dados Cadastrais"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <Divider />
      <CardContent>
        <List dense>
          {dataItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={item.label}
                  secondary={item.value}
                  primaryTypographyProps={{ 
                    variant: 'subtitle2', 
                    color: 'text.secondary' 
                  }}
                  secondaryTypographyProps={{ 
                    variant: 'body1',
                    color: 'text.primary'
                  }}
                />
              </ListItem>
              {index < dataItems.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default CompanyDataCard;