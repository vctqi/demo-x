import React from 'react';
import styled from 'styled-components';
import { formatDate, calculateOperationTime } from '../../utils/formatter';
import Card from '../common/Card';

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
`;

const InfoItem = styled.div`
  margin-bottom: 10px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #777;
  margin-bottom: 3px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const NotAvailable = styled.span`
  color: #999;
  font-style: italic;
  font-weight: normal;
`;

const CompanyInfo = ({ company }) => {
  if (!company) return null;

  return (
    <Card title="Dados da Empresa">
      <InfoGrid>
        <InfoItem>
          <InfoLabel>Razão Social</InfoLabel>
          <InfoValue>
            {company.razaoSocial || <NotAvailable>Não disponível</NotAvailable>}
          </InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>Nome Fantasia</InfoLabel>
          <InfoValue>
            {company.nomeFantasia || <NotAvailable>Não disponível</NotAvailable>}
          </InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>CNPJ</InfoLabel>
          <InfoValue>
            {company.formattedCNPJ || company.cnpj || <NotAvailable>Não disponível</NotAvailable>}
          </InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>Situação Cadastral</InfoLabel>
          <InfoValue>
            {company.situacaoCadastral || <NotAvailable>Não disponível</NotAvailable>}
          </InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>Data de Abertura</InfoLabel>
          <InfoValue>
            {company.dataAbertura 
              ? formatDate(company.dataAbertura) 
              : <NotAvailable>Não disponível</NotAvailable>}
          </InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>Tempo de Operação</InfoLabel>
          <InfoValue>
            {company.dataAbertura 
              ? calculateOperationTime(company.dataAbertura)
              : <NotAvailable>Não disponível</NotAvailable>}
          </InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>CNAE Principal</InfoLabel>
          <InfoValue>
            {company.cnaePrincipal
              ? `${company.cnaePrincipal} - ${company.cnaeDescricao || 'Não especificado'}`
              : <NotAvailable>Não disponível</NotAvailable>}
          </InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>Porte</InfoLabel>
          <InfoValue>
            {company.porte || <NotAvailable>Não disponível</NotAvailable>}
          </InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>Localização</InfoLabel>
          <InfoValue>
            {company.cidade && company.uf
              ? `${company.cidade}/${company.uf}`
              : <NotAvailable>Não disponível</NotAvailable>}
          </InfoValue>
        </InfoItem>
      </InfoGrid>
    </Card>
  );
};

export default CompanyInfo;