import React, { useState } from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import CnpjForm from './components/CnpjForm';
import ResultDashboard from './components/ResultDashboard';
import LoadingComponent from './components/LoadingComponent';
import ErrorComponent from './components/ErrorComponent';
import { analyzeCnpj } from './services/cnpjService';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleCnpjSubmit = async (cnpj) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeCnpj(cnpj);
      setResult(data);
    } catch (err) {
      setError({
        message: err.response?.data?.message || err.message || 'Ocorreu um erro inesperado',
        code: err.response?.data?.code || 'UNKNOWN_ERROR'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">Analisador de Risco via CNPJ</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="main-content">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <h1 className="text-center mb-4">Analisador de Risco de Cliente PJ</h1>
            <p className="text-center mb-4">
              Insira o CNPJ de uma empresa para realizar uma análise simplificada de risco baseada em dados públicos.
            </p>

            <CnpjForm onSubmit={handleCnpjSubmit} disabled={loading} />

            {loading && <LoadingComponent />}

            {error && <ErrorComponent error={error} />}

            {result && <ResultDashboard data={result} />}
          </Col>
        </Row>
      </Container>

      <footer className="footer text-center">
        <Container>
          <small className="text-muted">
            © 2025 Analisador de Risco via CNPJ - Esta análise é simplificada e baseada em dados públicos, não substituindo uma avaliação completa de crédito.
          </small>
        </Container>
      </footer>
    </div>
  );
}

export default App;