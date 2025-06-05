import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { formatarCNPJ } from '../utils/formatters';

/**
 * Componente de formulário para consulta de CNPJ
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onSubmit - Função chamada ao submeter o formulário
 * @param {boolean} props.isLoading - Indicador de carregamento
 */
const FormConsulta = ({ onSubmit, isLoading }) => {
    const [cnpj, setCnpj] = useState('');
    const [erro, setErro] = useState('');
    
    /**
     * Manipulador de mudança no campo de CNPJ
     * @param {Object} e - Evento de mudança
     */
    const handleChange = (e) => {
        // Aplicar formatação ao CNPJ
        const valorFormatado = formatarCNPJ(e.target.value);
        setCnpj(valorFormatado);
        
        // Limpar mensagem de erro quando o usuário digita
        if (erro) setErro('');
    };
    
    /**
     * Manipulador de submissão do formulário
     * @param {Object} e - Evento de submissão
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validar CNPJ
        const cnpjNumeros = cnpj.replace(/\D/g, '');
        
        if (cnpjNumeros.length !== 14) {
            setErro('CNPJ deve conter 14 dígitos.');
            return;
        }
        
        // Chamar função de submissão
        onSubmit(cnpjNumeros);
    };
    
    /**
     * Manipulador do botão limpar
     */
    const handleLimpar = () => {
        setCnpj('');
        setErro('');
    };
    
    return (
        <Card>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>CNPJ</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="00.000.000/0000-00"
                            value={cnpj}
                            onChange={handleChange}
                            disabled={isLoading}
                            maxLength={18}
                        />
                        <Form.Text className="text-muted">
                            Digite apenas os números ou com a formatação padrão.
                        </Form.Text>
                    </Form.Group>
                    
                    {erro && (
                        <Alert variant="danger">{erro}</Alert>
                    )}
                    
                    <div className="d-grid gap-2">
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Analisando...' : 'Analisar Risco'}
                        </Button>
                        <Button 
                            variant="outline-secondary" 
                            onClick={handleLimpar}
                            disabled={isLoading}
                        >
                            Limpar
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default FormConsulta;