import { carregarCarros, cardHTML, irParaCarro } from "./dados.js";
import { iniciarTestDrive } from "./testdrive-form.js";

const $ = (s) => document.querySelector(s);
let cars = [], td = null;

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

// Ordem dos destaques na página inicial (use o id de cada carro)
const ORDEM_DESTAQUES = [
  "pagani-huayra",
  "koenigsegg-jesko",
  "bugatti-chiron",
  "lamborghini-huracan",
  "porsche-911-gt3",
  "ferrari-roma",
];

// Mostra só os destaques da loja, na ordem acima
function render() {
  const pos = (c) => (ORDEM_DESTAQUES.includes(c.id) ? ORDEM_DESTAQUES.indexOf(c.id) : 99);
  const destaques = cars.filter((c) => c.destaque).sort((a, b) => pos(a) - pos(b));
  $("#grid").innerHTML = (destaques.length ? destaques : cars.slice(0, 4)).map((c) => cardHTML(c, true)).join("");
  tilt();
  observeAll();
}

// Card abre a página do carro; "Test-drive →" escolhe o carro no formulário
irParaCarro("#grid");
$("#grid").addEventListener("click", (e) => {
  const a = e.target.closest("[data-car]");
  if (a && td) td.escolher(a.dataset.car);
});

observeAll();
carregarCarros().then((lista) => {
  cars = lista;
  render();
  td = iniciarTestDrive(cars);
});