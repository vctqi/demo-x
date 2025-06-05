import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import FormConsulta from './components/FormConsulta';
import ResultadoConsulta from './components/ResultadoConsulta';
import api from './services/api';

function App() {
  // Estados
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  
  // Verificar saúde da API ao iniciar
  useEffect(() => {
    const verificarAPI = async () => {
      try {
        await api.verificarSaude();
        setApiStatus('online');
      } catch (error) {
        console.error('Erro ao verificar API:', error);
        setApiStatus('offline');
      }
    };
    
    verificarAPI();
  }, []);
  
  /**
   * Manipulador de consulta de CNPJ
   * @param {string} cnpj - CNPJ a ser consultado
   */
  const handleConsultarCNPJ = async (cnpj) => {
    // Limpar estados anteriores
    setErro(null);
    setLoading(true);
    
    try {
      // Realizar consulta
      const result = await api.consultarCNPJ(cnpj);
      
      // Atualizar resultado
      setResultado(result);
      
      // Mostrar notificação se for resultado de cache
      if (result.cache) {
        toast.info('Os dados apresentados são de uma consulta anterior (cache).');
      }
      
    } catch (error) {
      console.error('Erro na consulta:', error);
      
      // Definir mensagem de erro
      setErro(error.friendlyMessage || 'Erro ao consultar CNPJ. Tente novamente mais tarde.');
      
      // Mostrar notificação de erro
      toast.error(error.friendlyMessage || 'Erro ao consultar CNPJ');
      
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center">Analisador de Risco via CNPJ</h1>
            <p className="text-center text-muted">
              Insira o CNPJ para analisar o risco da empresa
            </p>
          </Col>
        </Row>
        
        {apiStatus === 'offline' && (
          <Alert variant="danger" className="mb-4">
            <Alert.Heading>API Indisponível</Alert.Heading>
            <p>
              O serviço de API está indisponível no momento. Não será possível realizar consultas.
              Por favor, tente novamente mais tarde.
            </p>
          </Alert>
        )}
        
        <Row className="justify-content-center mb-4">
          <Col md={6}>
            <FormConsulta 
              onSubmit={handleConsultarCNPJ} 
              isLoading={loading || apiStatus !== 'online'} 
            />
            
            {erro && (
              <Alert variant="danger" className="mt-3">
                {erro}
              </Alert>
            )}
          </Col>
        </Row>
        
        <Row className="justify-content-center">
          <Col md={10}>
            <ResultadoConsulta resultado={resultado} />
          </Col>
        </Row>
        
      </Container>
      
      <footer className="bg-light py-3 mt-5">
        <Container className="text-center">
          <p className="mb-0 text-muted">
            Analisador de Risco de Cliente PJ via CNPJ &copy; {new Date().getFullYear()}
          </p>
          <small className="text-muted">
            Os dados utilizados nesta aplicação são de caráter informativo e não substituem uma análise financeira completa.
          </small>
        </Container>
      </footer>
    </div>
  );
}

export default App;