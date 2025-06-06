import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import CompanyInfo from './CompanyInfo';
import RiskBadge from './RiskBadge';
import RiskFactors from './RiskFactors';
import AlertSignals from './AlertSignals';

function ResultDashboard({ data }) {
  const { company, risk_analysis } = data;

  return (
    <div className="result-dashboard">
      <Card className="mb-4">
        <Card.Header>Resultado da Análise</Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <h2 className="mb-3">{company.razao_social}</h2>
              <p className="text-muted mb-4">
                {company.nome_fantasia !== 'Não informado' ? company.nome_fantasia : ''}
              </p>
            </Col>
            <Col md={4} className="text-center text-md-end">
              <RiskBadge level={risk_analysis.level} score={risk_analysis.score} />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        <Col lg={6}>
          <CompanyInfo company={company} />
        </Col>
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Header>Fatores de Risco</Card.Header>
            <Card.Body>
              <RiskFactors factors={risk_analysis.factors} />
              
              {risk_analysis.alerts && risk_analysis.alerts.length > 0 && (
                <AlertSignals alerts={risk_analysis.alerts} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ResultDashboard;