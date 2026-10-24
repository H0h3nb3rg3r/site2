import { tilt } from "./comum.js";
import { carregarCarros, cardHTML, brl, irParaCarro } from "./dados.js";

const $ = (s) => document.querySelector(s);

const itens = [
  "Interior em couro e Alcantara",
  "Bancos esportivos aquecidos",
  "Sistema de som premium",
  "Câmera 360° e sensores de estacionamento",
  "Escapamento esportivo",
  "Rodas forjadas",
  "Controle de lançamento",
  "Modos de condução Sport e Track",
  "Laudo cautelar aprovado",
  "Garantia Veloce de 3 anos",
];

carregarCarros().then((cars) => {
  const id = new URLSearchParams(location.search).get("id");
  const c = cars.find((x) => x.id === id);

  if (!c) {
    $("#detalhe").innerHTML = `
      <div class="topo-pagina">
        <h1>Carro não <span>encontrado</span></h1>
        <p style="margin-bottom:24px">Esse carro não está mais disponível.</p>
        <a class="btn" href="/estoque.html">Voltar ao estoque</a>
      </div>`;
    return;
  }

  document.title = `${c.nome} | VELOCE Motors`;

  const specs = [
    ["Potência", c.cv && `${c.cv} cv`],
    ["0–100 km/h", c.s && `${c.s} s`],
    ["Velocidade máxima", c.vmax && `${c.vmax} km/h`],
    ["Torque", c.nm && `${c.nm} Nm`],
    ["Motor", c.motor],
    ["Câmbio", c.cambio],
    ["Tração", c.tracao],
    ["Ano", c.ano],
  ].filter(([, v]) => v);

  const relacionados = [
    ...cars.filter((x) => x.id !== c.id && x.tipo === c.tipo),
    ...cars.filter((x) => x.id !== c.id && x.tipo !== c.tipo),
  ].slice(0, 3);

  const desc = c.desc ||
    `O ${c.nome} é um ${c.tipo.toLowerCase()} de ${c.cv} cv que acelera de 0 a 100 km/h em ${c.s} segundos. Unidade ${c.ano}, revisada, com laudo cautelar aprovado e garantia Veloce.`;

  $("#detalhe").innerHTML = `
    <section class="det" style="--h:${c.h}">
      <div class="det-foto">
        <svg viewBox="0 0 300 100"><use href="#car"/></svg>
        ${c.img ? `<img src="${c.img}" alt="${c.nome}" onerror="this.remove()">` : ""}
      </div>
      <div class="det-info">
        <a class="voltar" href="/estoque.html">← Voltar ao estoque</a>
        <span class="tag">${c.tipo}</span>
        <h1>${c.nome}</h1>
        <p class="det-desc">${desc}</p>
        <div class="det-preco">${brl(c.preco)}</div>
        <div class="cta">
          <a class="btn" href="/test-drive.html?carro=${encodeURIComponent(c.nome)}">Agendar test-drive</a>
          <a class="btn ghost" href="/estoque.html">Ver outros carros</a>
        </div>
      </div>
    </section>

    <section class="pagina">
      <h2>Especificações</h2>
      <div class="det-specs">
        ${specs.map(([k, v]) => `<div class="spec"><small>${k}</small><strong>${v}</strong></div>`).join("")}
      </div>

      <h2>Cores <span>disponíveis</span></h2>
      <div class="chips fixo">${(c.cores || []).map((x) => `<span class="chip">${x}</span>`).join("")}</div>

      <h2>Itens de <span>série</span></h2>
      <ul class="det-itens">${(c.itens || itens).map((x) => `<li>${x}</li>`).join("")}</ul>

      <h2>Você também pode <span>gostar</span></h2>
      <div class="grid" id="grid">${relacionados.map((x) => cardHTML(x)).join("")}</div>
    </section>`;

  tilt();
  irParaCarro("#grid");
  scrollTo(0, 0);
});