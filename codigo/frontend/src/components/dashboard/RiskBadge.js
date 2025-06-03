import React from 'react';
import styled from 'styled-components';

const getBadgeColor = (riskLevel) => {
  switch (riskLevel) {
    case 'Baixo':
      return {
        background: '#e6f7e6',
        border: '#2ecc71',
        text: '#27ae60',
      };
    case 'Médio':
      return {
        background: '#fff9e6',
        border: '#f1c40f',
        text: '#f39c12',
      };
    case 'Alto':
      return {
        background: '#ffe6e6',
        border: '#e74c3c',
        text: '#c0392b',
      };
    default:
      return {
        background: '#f5f5f5',
        border: '#95a5a6',
        text: '#7f8c8d',
      };
  }
};

const BadgeContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: ${({ size }) => (size === 'large' ? '18px' : '14px')};
  background-color: ${({ colors }) => colors.background};
  color: ${({ colors }) => colors.text};
  border: 2px solid ${({ colors }) => colors.border};
`;

const RiskBadge = ({ riskLevel, score, size = 'medium', ...props }) => {
  const colors = getBadgeColor(riskLevel);
  
  return (
    <BadgeContainer colors={colors} size={size} {...props}>
      Risco {riskLevel} {score !== undefined && `(${score} pontos)`}
    </BadgeContainer>
  );
};

export default RiskBadge;