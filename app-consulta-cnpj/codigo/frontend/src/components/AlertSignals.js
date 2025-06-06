import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

function AlertSignals({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className="alerts-container">
      <div className="d-flex align-items-center mb-2">
        <FaExclamationTriangle className="text-warning me-2" />
        <h6 className="mb-0">Sinais de Alerta</h6>
      </div>
      <ul className="mb-0">
        {alerts.map((alert, index) => (
          <li key={index}>{alert}</li>
        ))}
      </ul>
    </div>
  );
}

export default AlertSignals;