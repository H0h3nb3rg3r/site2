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