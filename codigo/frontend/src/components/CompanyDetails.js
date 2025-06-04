import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Divider, 
  Box,
  Skeleton
} from '@mui/material';
import cnpjUtils from '../utils/cnpjUtils';

/**
 * Componente para exibição dos dados da empresa
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.company - Dados da empresa
 * @param {boolean} props.isLoading - Flag indicando se está carregando
 */
function CompanyDetails({ company, isLoading }) {
  // Se não houver dados da empresa ou estiver carregando, exibir skeleton
  if (isLoading) {
    return (
      <Card elevation={3} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            <Skeleton width="60%" />
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Typography variant="subtitle2" color="textSecondary">
                  <Skeleton width="40%" />
                </Typography>
                <Typography variant="body1">
                  <Skeleton width="70%" />
                </Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }
  
  // Se não houver dados da empresa, não renderizar nada
  if (!company) {
    return null;
  }
  
  return (
    <Card elevation={3} sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Dados da Empresa
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              CNPJ
            </Typography>
            <Typography variant="body1">
              {company.cnpjFormatado || cnpjUtils.formatarCnpj(company.cnpj)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Razão Social
            </Typography>
            <Typography variant="body1">
              {company.razaoSocial || "Não informado"}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Nome Fantasia
            </Typography>
            <Typography variant="body1">
              {company.nomeFantasia || "Não informado"}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Situação Cadastral
            </Typography>
            <Typography variant="body1">
              {company.situacao || "Não informado"}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Data de Abertura
            </Typography>
            <Typography variant="body1">
              {company.dataAbertura ? cnpjUtils.formatarData(company.dataAbertura) : "Não informado"}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Porte
            </Typography>
            <Typography variant="body1">
              {company.porte || "Não informado"}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              CNAE Principal
            </Typography>
            <Typography variant="body1">
              {company.cnae ? `${company.cnae} - ${company.descricaoCnae || ''}` : "Não informado"}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Localização
            </Typography>
            <Typography variant="body1">
              {company.municipio && company.uf ? `${company.municipio}/${company.uf}` : "Não informado"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default CompanyDetails;