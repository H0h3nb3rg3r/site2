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
  // Fotos em public/loja/ (1.jpg ... 6.jpg)
  fotos: [
    ["/loja/1.jpg", "Showroom"],
    ["/loja/2.jpg", "Supercarros"],
    ["/loja/3.jpg", "Lounge VIP"],
    ["/loja/4.jpg", "Fachada"],
    ["/loja/5.jpg", "Entrega do carro"],
    ["/loja/6.jpg", "Nossa equipe"],
  ],
};

export const SINAL = 0.05;  // sinal de reserva: 5% do valor do carro
export const FRETE = 3500;  // taxa de entrega em casa (R$)