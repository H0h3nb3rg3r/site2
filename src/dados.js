import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

export const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const T = { u: "Urbano · 30 min", e: "Estrada · 60 min", p: "Pista · 90 min" };

const base = [
  { nome: "Ferrari 296 GTB", tipo: "Supercarro", cv: 830, s: 2.9, preco: 4290000, h: 355, img: "/carros/ferrari-296.jpg", cores: ["Rosso Corsa", "Preto", "Branco"], testes: [T.u, T.e, T.p] },
  { nome: "Lamborghini Huracán", tipo: "Supercarro", cv: 640, s: 3.2, preco: 3650000, h: 50, img: "/carros/lamborghini-huracan.jpg", cores: ["Giallo", "Verde", "Preto"], testes: [T.u, T.p] },
  { nome: "Porsche 911 GT3", tipo: "Coupé", cv: 510, s: 3.4, preco: 2490000, h: 210, img: "/carros/porsche-911-gt3.jpg", cores: ["Azul Gentian", "Prata", "Branco"], testes: [T.u, T.e, T.p] },
  { nome: "McLaren 720S Spider", tipo: "Conversível", cv: 720, s: 2.9, preco: 4100000, h: 25, img: "/carros/mclaren-720s.jpg", cores: ["Laranja", "Cinza"], testes: [T.u, T.e] },
  { nome: "Aston Martin Vantage", tipo: "Coupé", cv: 665, s: 3.5, preco: 2790000, h: 150, img: "/carros/aston-martin-vantage.jpg", cores: ["Verde Racing", "Preto", "Prata"], testes: [T.u, T.e, T.p] },
  { nome: "Maserati MC20 Cielo", tipo: "Conversível", cv: 630, s: 3.0, preco: 3380000, h: 230, img: "/carros/maserati-mc20.jpg", cores: ["Azul", "Branco"], testes: [T.u, T.e] },
];

export async function carregarCarros() {
  try {
    const snap = await getDocs(collection(db, "carros"));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ h: 355, tipo: "Coupé", cores: ["Consulte"], testes: [T.u, T.e], ...d.data() }));
    }
  } catch (err) {
    console.warn("Usando estoque local:", err.message);
  }
  return base;
}