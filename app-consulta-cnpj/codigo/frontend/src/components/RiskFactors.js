import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

function RiskFactors({ factors }) {
  return (
    <ul className="factors-list mb-4">
      {factors.map((factor, index) => (
        <li key={index} className="d-flex justify-content-between align-items-center">
          <span>{factor.description}</span>
          <span 
            className={factor.impact >= 0 ? 'impact-positive' : 'impact-negative'}
          >
            {factor.impact >= 0 ? (
              <>
                <FaPlus className="me-1" size={12} />
                {factor.impact}
              </>
            ) : (
              <>
                <FaMinus className="me-1" size={12} />
                {Math.abs(factor.impact)}
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default RiskFactors;