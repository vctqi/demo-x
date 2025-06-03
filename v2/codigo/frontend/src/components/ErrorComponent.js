import React from 'react';
import { Alert, Card } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

function ErrorComponent({ error }) {
  // Define custom messages based on error code
  const getErrorMessage = () => {
    switch (error.code) {
      case 'INVALID_CNPJ':
        return 'O CNPJ informado é inválido. Verifique se digitou corretamente.';
      case 'NOT_FOUND':
        return 'CNPJ não encontrado na base de dados. Verifique se digitou corretamente.';
      case 'TIMEOUT':
        return 'A consulta demorou muito tempo. O serviço pode estar congestionado, tente novamente mais tarde.';
      case 'EXTERNAL_SERVICE_ERROR':
        return 'Não foi possível acessar o serviço de consulta de CNPJ. Tente novamente mais tarde.';
      default:
        return error.message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Alert variant="danger" className="mb-0">
          <div className="d-flex align-items-center">
            <FaExclamationTriangle size={24} className="me-3" />
            <div>
              <Alert.Heading>Erro na consulta</Alert.Heading>
              <p className="mb-0">{getErrorMessage()}</p>
            </div>
          </div>
        </Alert>
      </Card.Body>
    </Card>
  );
}

export default ErrorComponent;