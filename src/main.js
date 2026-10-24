import { db } from "./firebase.js";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

// Estoque local (usado se a coleção "carros" do Firestore estiver vazia)
const fallback = [
  { nome: "Ferrari 296 GTB", tipo: "Supercarro", cv: 830, s: 2.9, preco: 4290000, h: 355 },
  { nome: "Lamborghini Huracán", tipo: "Supercarro", cv: 640, s: 3.2, preco: 3650000, h: 50 },
  { nome: "Porsche 911 GT3", tipo: "Coupé", cv: 510, s: 3.4, preco: 2490000, h: 210 },
  { nome: "McLaren 720S Spider", tipo: "Conversível", cv: 720, s: 2.9, preco: 4100000, h: 25 },
  { nome: "Aston Martin Vantage", tipo: "Coupé", cv: 665, s: 3.5, preco: 2790000, h: 150 },
  { nome: "Maserati MC20 Cielo", tipo: "Conversível", cv: 630, s: 3.0, preco: 3380000, h: 230 },
];

const $ = (s) => document.querySelector(s);
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
let cars = fallback;

// Loader
addEventListener("load", () => setTimeout(() => $("#loader").classList.add("done"), 1300));

// Header e brilho do cursor
addEventListener("scroll", () => $("#nav").classList.toggle("scrolled", scrollY > 40));
addEventListener("mousemove", (e) => {
  const g = $("#glow");
  g.style.left = e.clientX + "px";
  g.style.top = e.clientY + "px";
});

// Revelar ao rolar + contadores
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  const n = e.target.querySelector("[data-n]");
  if (n) count(n);
  io.unobserve(e.target);
}), { threshold: 0.2 });

function count(el) {
  const end = +el.dataset.n, t0 = performance.now();
  const step = (t) => {
    const p = Math.min((t - t0) / 1600, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const observeAll = () => document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));

// Renderização do estoque
function render() {
  $("#grid").innerHTML = cars.map((c) => `
    <article class="car reveal" data-t="${c.tipo}" style="--h:${c.h}">
      <div class="pic"><svg viewBox="0 0 300 100"><use href="#car"/></svg></div>
      <div class="info">
        <span class="tag">${c.tipo}</span>
        <h3>${c.nome}</h3>
        <div class="specs"><div><b>${c.cv}</b>cv</div><div><b>${c.s}s</b>0–100</div></div>
        <div class="price">${brl(c.preco)} <a href="#agendar" data-car="${c.nome}">Test-drive →</a></div>
      </div>
    </article>`).join("");
  $("#carroSel").innerHTML = `<option value="">Escolha o carro</option>` + cars.map((c) => `<option>${c.nome}</option>`).join("");
  tilt();
  observeAll();
}

// Efeito 3D nos cards
function tilt() {
  document.querySelectorAll(".car").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });
}

// Filtros
$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  document.querySelectorAll("#filters button").forEach((x) => x.classList.toggle("on", x === b));
  document.querySelectorAll(".car").forEach((c) => c.classList.toggle("hide", b.dataset.f !== "todos" && c.dataset.t !== b.dataset.f));
});

// Pré-seleciona o carro ao clicar em "Test-drive"
$("#grid").addEventListener("click", (e) => {
  const a = e.target.closest("[data-car]");
  if (a) $("#carroSel").value = a.dataset.car;
});

// Firestore: carrega estoque (coleção "carros"), se existir
async function loadCars() {
  try {
    const snap = await getDocs(collection(db, "carros"));
    if (!snap.empty) cars = snap.docs.map((d) => ({ h: 355, tipo: "Coupé", ...d.data() }));
  } catch (err) {
    console.warn("Usando estoque local:", err.message);
  }
  render();
}

// Firestore: salva agendamentos na coleção "agendamentos"
$("#form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const st = $("#status"), btn = e.target.querySelector("button");
  btn.disabled = true;
  st.style.color = "";
  st.textContent = "Enviando...";
  try {
    await addDoc(collection(db, "agendamentos"), {
      ...Object.fromEntries(new FormData(e.target)),
      criadoEm: serverTimestamp(),
    });
    st.style.color = "#4ade80";
    st.textContent = "Test-drive agendado! Entraremos em contato em breve.";
    e.target.reset();
  } catch (err) {
    st.style.color = "#ff2a3d";
    st.textContent = "Erro ao enviar. Tente novamente.";
    console.error(err);
  }
  btn.disabled = false;
});

observeAll();
loadCars();