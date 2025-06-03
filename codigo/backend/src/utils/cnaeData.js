const config = require('../config/config');

/**
 * Dados iniciais para a tabela de CNAEs
 * Classificação simplificada de CNAEs por nível de risco
 */
const cnaeData = [
  // CNAEs de baixo risco
  {
    codigo: '6201500',
    descricao: 'Desenvolvimento de programas de computador sob encomenda',
    nivelRisco: 'Baixo',
    pontuacao: config.riskScoring.criteria.lowRiskCnae,
  },
  {
    codigo: '6202300',
    descricao: 'Desenvolvimento e licenciamento de programas de computador customizáveis',
    nivelRisco: 'Baixo',
    pontuacao: config.riskScoring.criteria.lowRiskCnae,
  },
  {
    codigo: '7020400',
    descricao: 'Atividades de consultoria em gestão empresarial',
    nivelRisco: 'Baixo',
    pontuacao: config.riskScoring.criteria.lowRiskCnae,
  },
  {
    codigo: '6911701',
    descricao: 'Serviços advocatícios',
    nivelRisco: 'Baixo',
    pontuacao: config.riskScoring.criteria.lowRiskCnae,
  },
  {
    codigo: '8599604',
    descricao: 'Treinamento em desenvolvimento profissional e gerencial',
    nivelRisco: 'Baixo',
    pontuacao: config.riskScoring.criteria.lowRiskCnae,
  },

  // CNAEs de médio risco
  {
    codigo: '4751201',
    descricao: 'Comércio varejista especializado de equipamentos e suprimentos de informática',
    nivelRisco: 'Médio',
    pontuacao: config.riskScoring.criteria.mediumRiskCnae,
  },
  {
    codigo: '4789099',
    descricao: 'Comércio varejista de outros produtos não especificados anteriormente',
    nivelRisco: 'Médio',
    pontuacao: config.riskScoring.criteria.mediumRiskCnae,
  },
  {
    codigo: '5611201',
    descricao: 'Restaurantes e similares',
    nivelRisco: 'Médio',
    pontuacao: config.riskScoring.criteria.mediumRiskCnae,
  },
  {
    codigo: '4729699',
    descricao: 'Comércio varejista de produtos alimentícios em geral',
    nivelRisco: 'Médio',
    pontuacao: config.riskScoring.criteria.mediumRiskCnae,
  },
  {
    codigo: '4781400',
    descricao: 'Comércio varejista de artigos do vestuário e acessórios',
    nivelRisco: 'Médio',
    pontuacao: config.riskScoring.criteria.mediumRiskCnae,
  },

  // CNAEs de alto risco
  {
    codigo: '4399103',
    descricao: 'Obras de alvenaria',
    nivelRisco: 'Alto',
    pontuacao: config.riskScoring.criteria.highRiskCnae,
  },
  {
    codigo: '6499999',
    descricao: 'Outras atividades de serviços financeiros não especificadas anteriormente',
    nivelRisco: 'Alto',
    pontuacao: config.riskScoring.criteria.highRiskCnae,
  },
  {
    codigo: '4511101',
    descricao: 'Comércio a varejo de automóveis, camionetas e utilitários novos',
    nivelRisco: 'Alto',
    pontuacao: config.riskScoring.criteria.highRiskCnae,
  },
  {
    codigo: '6612601',
    descricao: 'Corretoras de títulos e valores mobiliários',
    nivelRisco: 'Alto',
    pontuacao: config.riskScoring.criteria.highRiskCnae,
  },
  {
    codigo: '4120400',
    descricao: 'Construção de edifícios',
    nivelRisco: 'Alto',
    pontuacao: config.riskScoring.criteria.highRiskCnae,
  },
];

module.exports = cnaeData;