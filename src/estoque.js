import { tilt } from "./comum.js";
import { carregarCarros, cardHTML, irParaCarro } from "./dados.js";

const $ = (s) => document.querySelector(s);

let cars = [];
let filtro = "todos";

// Monta os botões de categoria a partir dos carros disponíveis
function montarFiltros() {
  const tipos = [...new Set(cars.map((c) => c.tipo))].sort();
  $("#filters").innerHTML =
    `<button class="on" data-f="todos">Todos</button>` +
    tipos.map((t) => `<button data-f="${t}">${t}</button>`).join("");
}

function render() {
  const termo = $("#busca").value.trim().toLowerCase();
  const ordem = $("#ordem").value;

  let lista = cars.filter(
    (c) => (filtro === "todos" || c.tipo === filtro) && c.nome.toLowerCase().includes(termo)
  );
  if (ordem === "menor") lista.sort((a, b) => a.preco - b.preco);
  if (ordem === "maior") lista.sort((a, b) => b.preco - a.preco);

  $("#grid").innerHTML = lista.length
    ? lista.map((c) => cardHTML(c)).join("")
    : `<p style="grid-column:1/-1;text-align:center;opacity:.7">Nenhum carro encontrado.</p>`;
  tilt();
}

$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  filtro = b.dataset.f;
  $("#filters").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
  render();
});
$("#busca").addEventListener("input", render);
$("#ordem").addEventListener("change", render);

irParaCarro("#grid");

carregarCarros().then((lista) => {
  cars = lista;
  montarFiltros();
  render();
});