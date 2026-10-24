import { tilt } from "./comum.js";
import { carregarCarros, cardHTML, irParaCarro } from "./dados.js";

const $ = (s) => document.querySelector(s);

let cars = [];
let filtro = "todos";

// Monta os botões de categoria e a lista de marcas a partir dos carros disponíveis
function montarFiltros() {
  const tipos = [...new Set(cars.map((c) => c.tipo))].sort();
  $("#filters").innerHTML =
    `<button class="on" data-f="todos">Todos</button>` +
    tipos.map((t) => `<button data-f="${t}">${t}</button>`).join("");

  const marcas = [...new Set(cars.map((c) => c.marca))].sort((a, b) => a.localeCompare(b));
  $("#marca").innerHTML =
    `<option value="">Todas as marcas</option>` +
    marcas.map((m) => `<option value="${m}">${m} (${cars.filter((c) => c.marca === m).length})</option>`).join("");

  // Permite abrir direto numa marca: /estoque.html?marca=Ferrari
  const pre = new URLSearchParams(location.search).get("marca");
  if (pre && marcas.includes(pre)) $("#marca").value = pre;
}

function render() {
  const termo = $("#busca").value.trim().toLowerCase();
  const ordem = $("#ordem").value;
  const marca = $("#marca").value;

  let lista = cars.filter(
    (c) =>
      (filtro === "todos" || c.tipo === filtro) &&
      (!marca || c.marca === marca) &&
      c.nome.toLowerCase().includes(termo)
  );

  // Ordenação: "campo-asc" ou "campo-desc" (ex.: cv-desc = mais potente primeiro)
  if (ordem) {
    const [campo, sentido] = ordem.split("-");
    const dir = sentido === "desc" ? -1 : 1;
    lista.sort((a, b) =>
      campo === "nome"
        ? dir * a.nome.localeCompare(b.nome)
        : dir * ((a[campo] ?? 0) - (b[campo] ?? 0))
    );
  }

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
$("#marca").addEventListener("change", render);
$("#ordem").addEventListener("change", render);

irParaCarro("#grid");

carregarCarros().then((lista) => {
  cars = lista;
  montarFiltros();
  render();
});