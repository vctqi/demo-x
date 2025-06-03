import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: #ffe6e6;
  border: 1px solid #ff9999;
  border-radius: 4px;
  padding: 10px 15px;
  margin: 10px 0;
  color: #d8000c;
  font-size: 14px;
  
  h4 {
    margin-top: 0;
    margin-bottom: 5px;
  }
  
  p {
    margin: 5px 0;
  }
  
  ul {
    margin: 5px 0;
    padding-left: 20px;
  }
`;

const ActionButton = styled.button`
  background-color: transparent;
  color: #d8000c;
  border: 1px solid #d8000c;
  padding: 5px 10px;
  border-radius: 4px;
  margin-top: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  
  &:hover {
    background-color: #ffcccc;
  }
`;

const ErrorMessage = ({ 
  title = 'Erro', 
  message, 
  suggestions = [], 
  onRetry,
  ...props 
}) => {
  return (
    <ErrorContainer {...props}>
      <h4>{title}</h4>
      {message && <p>{message}</p>}
      
      {suggestions && suggestions.length > 0 && (
        <>
          <p>Sugestões:</p>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </>
      )}
      
      {onRetry && (
        <ActionButton onClick={onRetry}>
          Tentar Novamente
        </ActionButton>
      )}
    </ErrorContainer>
  );
};

export default ErrorMessage;