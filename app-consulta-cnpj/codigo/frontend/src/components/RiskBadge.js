import React from 'react';
import { Badge } from 'react-bootstrap';
import { FaExclamationTriangle, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

function RiskBadge({ level, score }) {
  const getBadgeVariant = () => {
    switch (level) {
      case 'ALTO':
        return 'danger';
      case 'MÉDIO':
        return 'warning';
      case 'BAIXO':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'ALTO':
        return <FaExclamationTriangle className="me-2" />;
      case 'MÉDIO':
        return <FaExclamationCircle className="me-2" />;
      case 'BAIXO':
        return <FaCheckCircle className="me-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="risk-badge">
      <Badge 
        bg={getBadgeVariant()} 
        className="badge-risk d-inline-flex align-items-center"
      >
        {getIcon()}
        Risco {level.toLowerCase()}
      </Badge>
      <div className="mt-2 text-muted">
        <small>Score: {score} pontos</small>
      </div>
    </div>
  );
}

export default RiskBadge;