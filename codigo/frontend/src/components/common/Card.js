import React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 20px;
  margin-bottom: 20px;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }
`;

const CardTitle = styled.h3`
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const CardBody = styled.div`
  font-size: 14px;
`;

const Card = ({ title, children, ...props }) => {
  return (
    <StyledCard {...props}>
      {title && <CardTitle>{title}</CardTitle>}
      <CardBody>{children}</CardBody>
    </StyledCard>
  );
};

export default Card;