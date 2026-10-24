import { tilt } from "./comum.js";
import { carregarCarros, cardHTML, irParaCarro } from "./dados.js";

const $ = (s) => document.querySelector(s);
let cars = [], tipo = "todos";

// Botões de filtro gerados a partir das categorias dos carros
function filtros() {
  const tipos = ["todos", ...new Set(cars.map((c) => c.tipo))];
  $("#filters").innerHTML = tipos
    .map((t) => `<button class="${t === tipo ? "on" : ""}" data-f="${t}">${t === "todos" ? "Todos" : t}</button>`)
    .join("");
}

function desenhar() {
  const q = $("#busca").value.toLowerCase().trim();
  const ordem = $("#ordem").value;
  const lista = cars.filter((c) => (tipo === "todos" || c.tipo === tipo) && c.nome.toLowerCase().includes(q));
  if (ordem === "menor") lista.sort((a, b) => a.preco - b.preco);
  if (ordem === "maior") lista.sort((a, b) => b.preco - a.preco);
  $("#grid").innerHTML = lista.length ? lista.map((c) => cardHTML(c)).join("") : `<p class="vazio">Nenhum carro encontrado.</p>`;
  tilt();
}

$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  tipo = b.dataset.f;
  document.querySelectorAll("#filters button").forEach((x) => x.classList.toggle("on", x === b));
  desenhar();
});
$("#busca").addEventListener("input", desenhar);
$("#ordem").addEventListener("change", desenhar);
irParaCarro("#grid");

carregarCarros().then((lista) => {
  cars = lista;
  filtros();
  desenhar();
});