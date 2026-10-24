import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

export const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const T = { u: "Urbano · 30 min", e: "Estrada · 60 min", p: "Pista · 90 min" };

// id, nome, tipo, cv, 0-100, preço, matiz, ano, motor, torque(Nm), vmax, câmbio, tração, cores, testes(u/e/p), destaque
// O "1" no final da linha faz o carro aparecer em destaque na página inicial
const L = [
  ["ferrari-296", "Ferrari 296 GTB", "Supercarro", 830, 2.9, 4290000, 355, 2025, "V6 3.0 biturbo híbrido", 740, 330, "Automático 8 marchas", "Traseira", ["Rosso Corsa", "Preto", "Branco"], "uep"],
  ["lamborghini-huracan", "Lamborghini Huracán", "Supercarro", 640, 3.2, 3650000, 50, 2024, "V10 5.2 aspirado", 565, 325, "Automático 7 marchas", "Traseira", ["Giallo", "Verde", "Preto"], "up", 1],
  ["mclaren-720s", "McLaren 720S Spider", "Conversível", 720, 2.9, 4100000, 25, 2023, "V8 4.0 biturbo", 770, 341, "Automático 7 marchas", "Traseira", ["Laranja", "Cinza"], "ue"],
  ["porsche-911-gt3", "Porsche 911 GT3", "Coupé", 510, 3.4, 2490000, 210, 2024, "Boxer 4.0 aspirado", 470, 318, "PDK 7 marchas", "Traseira", ["Azul Gentian", "Prata", "Branco"], "uep", 1],
  ["aston-martin-vantage", "Aston Martin Vantage", "Coupé", 665, 3.5, 2790000, 150, 2024, "V8 4.0 biturbo", 800, 325, "Automático 8 marchas", "Traseira", ["Verde Racing", "Preto", "Prata"], "uep"],
  ["maserati-mc20", "Maserati MC20 Cielo", "Conversível", 630, 3.0, 3380000, 230, 2024, "V6 3.0 biturbo", 730, 325, "Automático 8 marchas", "Traseira", ["Azul", "Branco"], "ue"],
  ["ferrari-roma", "Ferrari Roma", "Coupé", 620, 3.4, 2650000, 0, 2023, "V8 3.9 biturbo", 760, 320, "Automático 8 marchas", "Traseira", ["Rosso", "Cinza", "Preto"], "ue", 1],
  ["lamborghini-urus", "Lamborghini Urus", "SUV", 666, 3.3, 3300000, 120, 2024, "V8 4.0 biturbo", 850, 305, "Automático 8 marchas", "Integral", ["Verde", "Preto", "Laranja"], "ue"],
  ["porsche-taycan", "Porsche Taycan Turbo S", "Elétrico", 761, 2.4, 1650000, 185, 2024, "Dois motores elétricos", 1050, 260, "Automático 2 marchas", "Integral", ["Azul", "Prata", "Preto"], "ue"],
  ["audi-r8", "Audi R8 V10 Performance", "Supercarro", 620, 3.1, 1790000, 270, 2023, "V10 5.2 aspirado", 580, 331, "S tronic 7 marchas", "Integral", ["Cinza Daytona", "Vermelho", "Branco"], "uep"],
  ["bmw-m4", "BMW M4 Competition", "Coupé", 510, 3.5, 1050000, 200, 2024, "6 cilindros 3.0 biturbo", 650, 290, "Automático 8 marchas", "Integral", ["Verde Isle of Man", "Preto", "Branco"], "uep"],
  ["mercedes-amg-gt", "Mercedes-AMG GT 63 S", "Coupé", 639, 3.2, 2350000, 60, 2024, "V8 4.0 biturbo", 900, 315, "Automático 9 marchas", "Integral", ["Cinza Selenite", "Preto", "Prata"], "ue"],
  ["mclaren-artura", "McLaren Artura", "Supercarro", 680, 3.0, 3100000, 35, 2024, "V6 3.0 biturbo híbrido", 720, 330, "Automático 8 marchas", "Traseira", ["Laranja", "Cinza", "Branco"], "up"],
  ["ferrari-portofino", "Ferrari Portofino M", "Conversível", 620, 3.5, 2400000, 350, 2022, "V8 3.9 biturbo", 760, 320, "Automático 8 marchas", "Traseira", ["Rosso", "Azul", "Branco"], "ue"],
  ["porsche-911-turbo-cabrio", "Porsche 911 Turbo S Cabriolet", "Conversível", 650, 2.7, 2900000, 195, 2024, "Boxer 3.7 biturbo", 800, 322, "PDK 8 marchas", "Integral", ["Prata GT", "Preto", "Azul"], "uep"],
  ["bentley-continental-gt", "Bentley Continental GT Speed", "Coupé", 782, 3.2, 3900000, 130, 2024, "V8 4.0 biturbo híbrido", 1000, 335, "Automático 8 marchas", "Integral", ["Verde British", "Preto", "Azul"], "ue"],
  ["nissan-gtr", "Nissan GT-R Nismo", "Coupé", 600, 2.9, 1450000, 5, 2022, "V6 3.8 biturbo", 652, 315, "Automático 6 marchas", "Integral", ["Branco", "Cinza", "Vermelho"], "uep"],
  ["corvette-z06", "Chevrolet Corvette Z06", "Supercarro", 679, 2.6, 1350000, 45, 2024, "V8 5.5 aspirado", 623, 315, "Automático 8 marchas", "Traseira", ["Amarelo", "Preto", "Azul"], "uep"],
  ["mercedes-amg-sl63", "Mercedes-AMG SL 63", "Conversível", 585, 3.6, 1950000, 300, 2024, "V8 4.0 biturbo", 800, 315, "Automático 9 marchas", "Integral", ["Prata", "Preto", "Branco"], "ue"],
  ["bmw-x5m", "BMW X5 M Competition", "SUV", 625, 3.8, 1200000, 215, 2024, "V8 4.4 biturbo", 750, 290, "Automático 8 marchas", "Integral", ["Preto", "Azul Marina", "Branco"], "ue"],
  ["koenigsegg-jesko", "Koenigsegg Jesko", "Hipercarro", 1600, 2.5, 16500000, 25, 2024, "V8 5.0 biturbo", 1500, 480, "Automático 9 marchas", "Traseira", ["Preto Carbono", "Branco", "Laranja"], "up", 1],
  ["koenigsegg-gemera", "Koenigsegg Gemera", "Hipercarro", 1700, 1.9, 11000000, 200, 2024, "3 cilindros 2.0 biturbo híbrido", 3500, 400, "Direct Drive", "Integral", ["Cinza", "Azul", "Branco"], "ue"],
  ["bugatti-chiron", "Bugatti Chiron", "Hipercarro", 1500, 2.4, 16000000, 215, 2023, "W16 8.0 quadriturbo", 1600, 420, "Automático 7 marchas", "Integral", ["Azul Bugatti", "Preto", "Vermelho"], "ue", 1],
  ["pagani-huayra", "Pagani Huayra", "Hipercarro", 730, 2.8, 17500000, 45, 2022, "V12 6.0 biturbo", 1000, 370, "Sequencial 7 marchas", "Traseira", ["Prata", "Preto", "Azul"], "ue", 1],
  ["rimac-nevera", "Rimac Nevera", "Elétrico", 1914, 2.0, 13500000, 180, 2024, "Quatro motores elétricos", 2360, 412, "Automático 1 marcha", "Integral", ["Branco", "Preto", "Azul"], "ue"],
  ["ferrari-sf90", "Ferrari SF90 Stradale", "Supercarro", 1000, 2.5, 5600000, 355, 2024, "V8 4.0 biturbo híbrido", 800, 340, "Automático 8 marchas", "Integral", ["Rosso Corsa", "Preto", "Amarelo"], "uep"],
  ["lamborghini-revuelto", "Lamborghini Revuelto", "Supercarro", 1015, 2.5, 5400000, 130, 2024, "V12 6.5 híbrido", 725, 350, "Automático 8 marchas", "Integral", ["Laranja", "Verde", "Preto"], "ue"],
  ["mclaren-765lt", "McLaren 765LT", "Supercarro", 765, 2.8, 4800000, 35, 2023, "V8 4.0 biturbo", 800, 330, "Automático 7 marchas", "Traseira", ["Laranja", "Cinza", "Preto"], "up"],
  ["aston-martin-db12", "Aston Martin DB12", "Coupé", 680, 3.6, 3300000, 150, 2024, "V8 4.0 biturbo", 800, 325, "Automático 8 marchas", "Traseira", ["Verde Racing", "Cinza", "Preto"], "uep"],
  ["rolls-royce-spectre", "Rolls-Royce Spectre", "Elétrico", 584, 4.5, 3900000, 250, 2024, "Dois motores elétricos", 900, 250, "Automático 1 marcha", "Integral", ["Preto", "Branco", "Azul"], "ue"],
  ["lotus-emira", "Lotus Emira", "Coupé", 405, 4.3, 1100000, 60, 2024, "V6 3.5 supercharged", 420, 290, "Automático 6 marchas", "Traseira", ["Amarelo", "Verde", "Cinza"], "uep"],
  ["ford-gt", "Ford GT", "Supercarro", 647, 3.0, 3700000, 215, 2022, "V6 3.5 biturbo", 746, 348, "Automático 7 marchas", "Traseira", ["Azul", "Branco", "Preto"], "ue"],
];

const base = L.map(([id, nome, tipo, cv, s, preco, h, ano, motor, nm, vmax, cambio, tracao, cores, t, destaque]) => ({
  id, nome, tipo, cv, s, preco, h, ano, motor, nm, vmax, cambio, tracao, cores,
  testes: [...t].map((k) => T[k]),
  destaque: !!destaque,
}));

// Marcas (ordem importa: nomes compostos primeiro). Carros novos do Firestore
// podem ter o campo "marca"; se não tiver, ela é descoberta pelo nome.
const MARCAS = ["Aston Martin", "Mercedes-AMG", "Rolls-Royce", "Lamborghini", "Koenigsegg", "Maserati", "McLaren", "Porsche", "Ferrari", "Bentley", "Bugatti", "Pagani", "Chevrolet", "Nissan", "Rimac", "Lotus", "Audi", "BMW", "Ford"];
const marcaDe = (nome) => MARCAS.find((m) => nome.startsWith(m)) || nome.split(" ")[0];

// Completa campos que faltarem (ex.: carros cadastrados no Firestore)
const pronto = (c) => ({
  h: 355, tipo: "Coupé", ano: 2024, cores: ["Consulte"], testes: [T.u, T.e],
  ...c,
  marca: c.marca || marcaDe(c.nome),
  img: c.img || `/carros/${c.id}.jpg`,
});

export async function carregarCarros() {
  try {
    const snap = await getDocs(collection(db, "carros"));
    if (!snap.empty) return snap.docs.map((d) => pronto({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn("Usando estoque local:", err.message);
  }
  return base.map(pronto);
}

// Card de carro usado na home, no estoque e na página de detalhes
export const cardHTML = (c, home = false) => `
  <article class="car${home ? " reveal" : ""}" data-id="${c.id}" style="--h:${c.h}">
    <div class="pic">
      ${c.img ? `<img src="${c.img}" alt="${c.nome}" loading="lazy" onerror="this.remove()">` : ""}
      <svg viewBox="0 0 300 100"><use href="#car"/></svg>
    </div>
    <div class="info">
      <span class="tag">${c.tipo}</span>
      <h3>${c.nome}</h3>
      <div class="specs"><div><b>${c.cv}</b>cv</div><div><b>${c.s}s</b>0–100</div></div>
      <div class="price">${brl(c.preco)} ${home
        ? `<a href="#agendar" data-car="${c.nome}">Test-drive →</a>`
        : `<a href="/test-drive.html?carro=${encodeURIComponent(c.nome)}">Test-drive →</a>`}</div>
    </div>
  </article>`;

// Clicar no card (fora do link) abre a página do carro
export const irParaCarro = (grid) => {
  document.querySelector(grid).addEventListener("click", (e) => {
    const card = e.target.closest(".car");
    if (card && !e.target.closest("a")) location.href = `/carro.html?id=${card.dataset.id}`;
  });
};