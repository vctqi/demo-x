import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #3498db;
  color: white;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  margin: 5px 0 0;
  font-size: 14px;
  opacity: 0.8;
`;

const Header = ({ title, subtitle, ...props }) => {
  return (
    <HeaderContainer {...props}>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </HeaderContainer>
  );
};

export default Header;