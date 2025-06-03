import React from 'react';
import { Spinner, Card } from 'react-bootstrap';

function LoadingComponent() {
  return (
    <Card className="text-center p-4 mb-4">
      <Card.Body>
        <Spinner animation="border" role="status" variant="primary" className="mb-2" />
        <Card.Title>Consultando CNPJ</Card.Title>
        <Card.Text className="text-muted">
          Aguarde enquanto consultamos os dados e realizamos a análise de risco...
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default LoadingComponent;