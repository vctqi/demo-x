import React from 'react';
import { Card, Row, Col, Badge, Alert } from 'react-bootstrap';
import { 
    formatarData, 
    formatarDataHora, 
    getClasseRisco, 
    formatarNumeroComSinal 
} from '../utils/formatters';

/**
 * Componente para exibir o resultado da consulta de CNPJ
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.resultado - Dados do resultado da consulta
 */
const ResultadoConsulta = ({ resultado }) => {
    // Se não houver resultado, não renderizar nada
    if (!resultado) return null;
    
    // Extrair dados do resultado
    const {
        cnpj,
        razao_social,
        data_abertura,
        situacao_cadastral,
        cnae_principal,
        porte,
        municipio,
        uf,
        score,
        classificacao_risco,
        criterios,
        data_consulta,
        cache
    } = resultado;
    
    return (
        <Card className="mt-4">
            <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Resultado da Análise</h5>
                    <Badge 
                        bg={getClasseRisco(classificacao_risco)} 
                        className="p-2"
                    >
                        Risco {classificacao_risco}
                    </Badge>
                </div>
            </Card.Header>
            
            <Card.Body>
                {cache && (
                    <Alert variant="info" className="mb-3">
                        <strong>Dados de cache:</strong> Esta consulta foi realizada anteriormente em {formatarDataHora(data_consulta)}.
                    </Alert>
                )}
                
                <Row>
                    <Col md={6}>
                        <h6>Dados da Empresa</h6>
                        <dl className="row">
                            <dt className="col-sm-4">CNPJ:</dt>
                            <dd className="col-sm-8">{cnpj}</dd>
                            
                            <dt className="col-sm-4">Razão Social:</dt>
                            <dd className="col-sm-8">{razao_social}</dd>
                            
                            <dt className="col-sm-4">Data de Abertura:</dt>
                            <dd className="col-sm-8">{formatarData(data_abertura)}</dd>
                            
                            <dt className="col-sm-4">Situação Cadastral:</dt>
                            <dd className="col-sm-8">{situacao_cadastral}</dd>
                            
                            <dt className="col-sm-4">CNAE Principal:</dt>
                            <dd className="col-sm-8">{cnae_principal}</dd>
                            
                            <dt className="col-sm-4">Porte:</dt>
                            <dd className="col-sm-8">{porte}</dd>
                            
                            <dt className="col-sm-4">Localização:</dt>
                            <dd className="col-sm-8">{municipio}/{uf}</dd>
                        </dl>
                    </Col>
                    
                    <Col md={6}>
                        <h6>Análise de Risco</h6>
                        <p>
                            <strong>Score:</strong> {score} pontos
                            <Badge 
                                bg={getClasseRisco(classificacao_risco)} 
                                className="ms-2"
                            >
                                {classificacao_risco}
                            </Badge>
                        </p>
                        
                        <p><strong>Critérios Aplicados:</strong></p>
                        <ul className="list-group mb-3">
                            {criterios && criterios.map((criterio, index) => (
                                <li 
                                    key={index} 
                                    className={`list-group-item d-flex justify-content-between align-items-center ${
                                        criterio.pontuacao > 0 
                                            ? 'list-group-item-success' 
                                            : criterio.pontuacao < 0 
                                                ? 'list-group-item-danger' 
                                                : ''
                                    }`}
                                >
                                    {criterio.nome}
                                    <Badge 
                                        bg={criterio.pontuacao > 0 ? 'success' : criterio.pontuacao < 0 ? 'danger' : 'secondary'}
                                    >
                                        {formatarNumeroComSinal(criterio.pontuacao)}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                        
                        <div className="mt-3">
                            <h6>Classificação de Risco:</h6>
                            <ul>
                                <li>Score ≥ 20: <Badge bg="success">Baixo Risco</Badge></li>
                                <li>Score entre 0 e 19: <Badge bg="warning" text="dark">Médio Risco</Badge></li>
                                <li>Score &lt; 0: <Badge bg="danger">Alto Risco</Badge></li>
                            </ul>
                        </div>
                    </Col>
                </Row>
                
                <div className="text-muted mt-3">
                    <small>Consulta realizada em: {formatarDataHora(data_consulta)}</small>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ResultadoConsulta;