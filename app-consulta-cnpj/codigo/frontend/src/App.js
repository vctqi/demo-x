import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap'; // ADDED Nav
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
      <Navbar className="tqi-navbar" expand="lg"> {/* MODIFIED: className, removed bg/variant */}
        <Container>
          <Navbar.Brand href="#" className="d-flex align-items-center"> {/* ADDED: d-flex, align-items-center for logo alignment */}
            <img
              src={process.env.PUBLIC_URL + "/assets/tqi-logo.svg"} // MODIFIED: Local path
              alt="TQI Logo"
              className="navbar-logo-tqi me-2" // Class for styling, me-2 for margin
            />
            Analisador de Risco via CNPJ
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* ADDED: For responsive collapse */}
          <Navbar.Collapse id="basic-navbar-nav"> {/* ADDED: For responsive collapse */}
            <Nav className="ms-auto"> {/* ms-auto pushes content to the right */}
              <Nav.Item>
                <img
                  src={process.env.PUBLIC_URL + "/assets/febraban-logo.png"} // MODIFIED: Local path
                  alt="Febraban Tech 2025 Logo"
                  className="navbar-logo-febraban" // Class for styling
                />
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
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
