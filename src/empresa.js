import { LOJA, SINAL, FRETE } from "./loja.js";

// TROQUE pelos dados reais da empresa antes de publicar
export const EMPRESA = {
  razao: "VELOCE Motors Comércio de Veículos Ltda",
  fantasia: "VELOCE Motors",
  cnpj: "00.000.000/0001-00",
  emailPrivacidade: "privacidade@seudominio.com.br",
  atualizado: "28/10/2026",
  reservaDias: 3, // por quantos dias o sinal garante o carro
};

export const dados = {
  razao: EMPRESA.razao,
  fantasia: EMPRESA.fantasia,
  cnpj: EMPRESA.cnpj,
  endereco: `${LOJA.endereco} — ${LOJA.cidade}`,
  telefone: LOJA.telefone,
  email: LOJA.email,
  emailPrivacidade: EMPRESA.emailPrivacidade,
  atualizado: EMPRESA.atualizado,
  reservaDias: String(EMPRESA.reservaDias),
  sinal: `${Math.round(SINAL * 100)}%`,
  frete: FRETE.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }),
};