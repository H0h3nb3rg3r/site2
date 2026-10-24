// Dados da concessionária: troque pelos dados reais
export const LOJA = {
  nome: "VELOCE Motors",
  endereco: "Av. Nereu Ramos, 22D",
  cidade: "Chapecó - SC",
  telefone: "(49) 99201-2758",
  whatsapp: "5549992012758", // só números, com 55 + DDD
  email: "bruno@veloce.com.br",
  mapa: "Av. Nereu Ramos, 22D, Chapecó - SC", // texto usado no Google Maps
  horario: [
    ["Segunda a sexta", "09h às 19h"],
    ["Sábado", "09h às 16h"],
    ["Domingo", "Fechado"],
  ],
  // Vendedores: TROQUE pelos nomes e números reais (whatsapp: só números, com 55 + DDD)
  vendedores: [
    { nome: "Carlos Mendes", cargo: "Consultor de supercarros", telefone: "(49) 90000-0001", whatsapp: "5549900000001", email: "carlos@veloce.com.br" },
    { nome: "Ana Souza", cargo: "Consultora de hipercarros e exclusivos", telefone: "(49) 90000-0002", whatsapp: "5549900000002", email: "ana@veloce.com.br" },
    { nome: "Rafael Lima", cargo: "Consultor de esportivos e conversíveis", telefone: "(49) 90000-0003", whatsapp: "5549900000003", email: "rafael@veloce.com.br" },
    { nome: "Juliana Alves", cargo: "Financiamento e pós-venda", telefone: "(49) 90000-0004", whatsapp: "5549900000004", email: "juliana@veloce.com.br" },
  ],
  // Fotos em public/loja/ (os nomes precisam ser iguais aos dos arquivos)
  fotos: [
    ["/loja/showroom.avif", "Showroom"],
    ["/loja/supercarros.jpg", "Supercarros"],
    ["/loja/loungue%20vip.png", "Lounge VIP"],
    ["/loja/fachada.jpg", "Fachada"],
    ["/loja/entrega%20do%20carro.jpg", "Entrega do carro"],
    ["/loja/equipe.webp", "Nossa equipe"],
  ],
};

export const SINAL = 0.05;  // sinal de reserva: 5% do valor do carro
export const FRETE = 3500;  // taxa de entrega em casa (R$)