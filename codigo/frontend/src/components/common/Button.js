import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: #3498db;
          color: white;
          border: 1px solid #2980b9;
          
          &:hover {
            background-color: #2980b9;
          }
          
          &:disabled {
            background-color: #a4c9e4;
            border-color: #a4c9e4;
            cursor: not-allowed;
          }
        `;
      case 'secondary':
        return `
          background-color: #f1f1f1;
          color: #333;
          border: 1px solid #ddd;
          
          &:hover {
            background-color: #e1e1e1;
          }
          
          &:disabled {
            background-color: #f8f8f8;
            color: #999;
            cursor: not-allowed;
          }
        `;
      case 'danger':
        return `
          background-color: #e74c3c;
          color: white;
          border: 1px solid #c0392b;
          
          &:hover {
            background-color: #c0392b;
          }
          
          &:disabled {
            background-color: #f5b8b1;
            border-color: #f5b8b1;
            cursor: not-allowed;
          }
        `;
      default:
        return `
          background-color: #3498db;
          color: white;
          border: 1px solid #2980b9;
          
          &:hover {
            background-color: #2980b9;
          }
          
          &:disabled {
            background-color: #a4c9e4;
            border-color: #a4c9e4;
            cursor: not-allowed;
          }
        `;
    }
  }}
  
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  disabled = false, 
  fullWidth = false, 
  onClick, 
  ...props 
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;