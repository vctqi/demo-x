import React from 'react';
import styled from 'styled-components';
import CompanyInfo from './CompanyInfo';
import RiskBadge from './RiskBadge';
import ScoreDetails from './ScoreDetails';

const ResultsContainer = styled.div`
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const RiskSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
`;

const RiskTitle = styled.h3`
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;
  font-style: italic;
`;

const ResultsPanel = ({ analysisResult }) => {
  if (!analysisResult) {
    return <NoResults>Nenhum resultado para exibir. Insira um CNPJ para análise.</NoResults>;
  }
  
  const { company, riskAnalysis } = analysisResult;
  
  return (
    <ResultsContainer>
      <RiskSummary>
        <RiskTitle>Classificação de Risco</RiskTitle>
        <RiskBadge 
          riskLevel={riskAnalysis.riskLevel} 
          score={riskAnalysis.score} 
          size="large"
        />
      </RiskSummary>
      
      <CompanyInfo company={company} />
      <ScoreDetails riskAnalysis={riskAnalysis} />
    </ResultsContainer>
  );
};

export default ResultsPanel;