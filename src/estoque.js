import { tilt } from "./comum.js";
import { carregarCarros, brl } from "./dados.js";

const $ = (s) => document.querySelector(s);
let cars = [], tipo = "todos";

const card = (c) => `
  <article class="car" style="--h:${c.h}">
    <div class="pic">
      ${c.img ? `<img src="${c.img}" alt="${c.nome}" loading="lazy" onerror="this.remove()">` : ""}
      <svg viewBox="0 0 300 100"><use href="#car"/></svg>
    </div>
    <div class="info">
      <span class="tag">${c.tipo}</span>
      <h3>${c.nome}</h3>
      <div class="specs"><div><b>${c.cv}</b>cv</div><div><b>${c.s}s</b>0–100</div></div>
      <div class="price">${brl(c.preco)} <a href="/test-drive.html?carro=${encodeURIComponent(c.nome)}">Test-drive →</a></div>
    </div>
  </article>`;

function desenhar() {
  const q = $("#busca").value.toLowerCase().trim();
  const ordem = $("#ordem").value;
  const lista = cars.filter((c) => (tipo === "todos" || c.tipo === tipo) && c.nome.toLowerCase().includes(q));
  if (ordem === "menor") lista.sort((a, b) => a.preco - b.preco);
  if (ordem === "maior") lista.sort((a, b) => b.preco - a.preco);
  $("#grid").innerHTML = lista.length ? lista.map(card).join("") : `<p class="vazio">Nenhum carro encontrado.</p>`;
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

carregarCarros().then((lista) => {
  cars = lista;
  desenhar();
});