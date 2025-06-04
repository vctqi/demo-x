import React, { useState } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import Button from '../common/Button';

const DetailsContainer = styled.div`
  margin-top: 10px;
`;

const CriteriaSection = styled.div`
  margin-top: 15px;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  margin-bottom: 10px;
  color: #333;
`;

const CriteriaList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CriteriaItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f1f1;
  font-size: 14px;
  
  &:last-child {
    border-bottom: none;
  }
`;

const CriteriaName = styled.span`
  flex: 1;
`;

const CriteriaPoints = styled.span`
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: 10px;
  
  ${({ impact }) => {
    switch (impact) {
      case 'positive':
        return 'color: #27ae60; background-color: #e6f7e6;';
      case 'negative':
        return 'color: #c0392b; background-color: #ffe6e6;';
      default:
        return 'color: #7f8c8d; background-color: #f5f5f5;';
    }
  }}
`;

const ScoreSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-top: 15px;
  font-weight: 600;
`;

const ToggleButton = styled(Button)`
  margin-top: 10px;
`;

const ScoreDetails = ({ riskAnalysis }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!riskAnalysis || !riskAnalysis.appliedCriteria) return null;
  
  // Separa os critérios por impacto
  const positiveCriteria = riskAnalysis.appliedCriteria.filter(c => c.impact === 'positive');
  const negativeCriteria = riskAnalysis.appliedCriteria.filter(c => c.impact === 'negative');
  const neutralCriteria = riskAnalysis.appliedCriteria.filter(c => c.impact === 'neutral');
  
  return (
    <Card title="Detalhes da Análise de Risco">
      <ToggleButton 
        variant="secondary" 
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Esconder Detalhes' : 'Mostrar Detalhes'}
      </ToggleButton>
      
      {expanded && (
        <DetailsContainer>
          {positiveCriteria.length > 0 && (
            <CriteriaSection>
              <SectionTitle>Fatores Positivos</SectionTitle>
              <CriteriaList>
                {positiveCriteria.map((criteria, index) => (
                  <CriteriaItem key={index}>
                    <CriteriaName>{criteria.name}</CriteriaName>
                    <CriteriaPoints impact="positive">+{criteria.points}</CriteriaPoints>
                  </CriteriaItem>
                ))}
              </CriteriaList>
            </CriteriaSection>
          )}
          
          {negativeCriteria.length > 0 && (
            <CriteriaSection>
              <SectionTitle>Fatores Negativos</SectionTitle>
              <CriteriaList>
                {negativeCriteria.map((criteria, index) => (
                  <CriteriaItem key={index}>
                    <CriteriaName>{criteria.name}</CriteriaName>
                    <CriteriaPoints impact="negative">{criteria.points}</CriteriaPoints>
                  </CriteriaItem>
                ))}
              </CriteriaList>
            </CriteriaSection>
          )}
          
          {neutralCriteria.length > 0 && (
            <CriteriaSection>
              <SectionTitle>Fatores Neutros</SectionTitle>
              <CriteriaList>
                {neutralCriteria.map((criteria, index) => (
                  <CriteriaItem key={index}>
                    <CriteriaName>{criteria.name}</CriteriaName>
                    <CriteriaPoints impact="neutral">{criteria.points}</CriteriaPoints>
                  </CriteriaItem>
                ))}
              </CriteriaList>
            </CriteriaSection>
          )}
          
          <ScoreSummary>
            <span>Pontuação Total:</span>
            <span>{riskAnalysis.score} pontos</span>
          </ScoreSummary>
        </DetailsContainer>
      )}
    </Card>
  );
};

export default ScoreDetails;