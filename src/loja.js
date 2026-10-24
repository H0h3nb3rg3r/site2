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
  // Fotos provisórias (usam as imagens dos carros que já existem no projeto).
  // Quando tiver as fotos reais, coloque-as em public/loja/ (1.jpg ... 6.jpg)
  // e troque os caminhos por "/loja/1.jpg", "/loja/2.jpg" etc.
  fotos: [
    ["/carros/ferrari-296.jpg", "Showroom"],
    ["/carros/lamborghini-huracan.jpg", "Supercarros"],
    ["/carros/porsche-911-gt3.jpg", "Lounge VIP"],
    ["/carros/mclaren-720s.jpg", "Fachada"],
    ["/carros/audi-r8.jpg", "Entrega do carro"],
    ["/carros/bmw-m4.jpg", "Nossa equipe"],
  ],
};

export const SINAL = 0.05;  // sinal de reserva: 5% do valor do carro
export const FRETE = 3500;  // taxa de entrega em casa (R$)