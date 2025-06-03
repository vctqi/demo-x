import React, { useState } from 'react';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { validateCnpj, formatCnpj } from '../utils/cnpjUtils';

function CnpjForm({ onSubmit, disabled }) {
  const [cnpj, setCnpj] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');

  const handleCnpjChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 14) {
      setCnpj(value);
      setError('');
      setValidated(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);

    if (!cnpj || cnpj.length !== 14) {
      setError('CNPJ deve conter 14 dígitos');
      return;
    }

    if (!validateCnpj(cnpj)) {
      setError('CNPJ inválido');
      return;
    }

    onSubmit(cnpj);
  };

  return (
    <Card className="mb-4 cnpj-form">
      <Card.Header>Consulta de CNPJ</Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>CNPJ da Empresa</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                placeholder="Digite apenas os números do CNPJ"
                value={cnpj ? formatCnpj(cnpj) : ''}
                onChange={handleCnpjChange}
                isInvalid={!!error}
                className="cnpj-input"
                required
                disabled={disabled}
              />
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Text className="text-muted">
              Exemplo: 00.000.000/0001-00
            </Form.Text>
          </Form.Group>

          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={disabled || cnpj.length !== 14}
            >
              Analisar Risco
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default CnpjForm;