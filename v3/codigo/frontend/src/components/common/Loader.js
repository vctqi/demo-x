import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Spinner = styled.div`
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 10px;
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0;
`;

const Loader = ({ message = 'Carregando...', ...props }) => {
  return (
    <LoaderContainer {...props}>
      <Spinner />
      <LoadingText>{message}</LoadingText>
    </LoaderContainer>
  );
};

export default Loader;