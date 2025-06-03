import React from 'react';
import { Card, Table } from 'react-bootstrap';

function CompanyInfo({ company }) {
  const formatDate = (dateString) => {
    if (dateString === 'Não informado') return dateString;
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header>Dados da Empresa</Card.Header>
      <Card.Body className="p-0">
        <Table className="company-info-table mb-0">
          <tbody>
            <tr>
              <th>CNPJ</th>
              <td>{company.cnpj}</td>
            </tr>
            <tr>
              <th>Situação Cadastral</th>
              <td>{company.situacao_cadastral}</td>
            </tr>
            <tr>
              <th>Data de Abertura</th>
              <td>{formatDate(company.data_abertura)}</td>
            </tr>
            <tr>
              <th>CNAE Principal</th>
              <td>
                {company.cnae_principal.codigo} - {company.cnae_principal.descricao}
              </td>
            </tr>
            <tr>
              <th>Porte</th>
              <td>{company.porte}</td>
            </tr>
            <tr>
              <th>Endereço</th>
              <td>
                {company.endereco.logradouro}, {company.endereco.numero}
                {company.endereco.complemento ? `, ${company.endereco.complemento}` : ''}<br />
                {company.endereco.bairro} - {company.endereco.municipio}/{company.endereco.uf}<br />
                CEP: {company.endereco.cep}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default CompanyInfo;