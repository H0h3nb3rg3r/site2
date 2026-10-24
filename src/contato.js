import "./comum.js";
import { LOJA } from "./loja.js";

const $ = (s) => document.querySelector(s);
const q = encodeURIComponent(LOJA.mapa);
const soNumeros = (t) => t.replace(/\D/g, "");

// Canais da loja
$("#c-zap").href = `https://wa.me/${LOJA.whatsapp}`;
$("#c-tel").textContent = LOJA.telefone;
$("#c-tel").href = `tel:${soNumeros(LOJA.telefone)}`;
$("#c-email").textContent = LOJA.email;
$("#c-email").href = `mailto:${LOJA.email}`;
$("#c-end").textContent = `${LOJA.endereco} — ${LOJA.cidade}`;
$("#c-rota").href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
$("#c-horario").innerHTML = LOJA.horario.map(([d, h]) => `<li><span>${d}</span><b>${h}</b></li>`).join("");

// Vendedores
const iniciais = (nome) => nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

$("#vendedores").innerHTML = (LOJA.vendedores || []).map((v) => `
  <article class="vendedor">
    <div class="avatar">${iniciais(v.nome)}</div>
    <h3>${v.nome}</h3>
    <p class="cargo">${v.cargo}</p>
    <div class="vend-links">
      <a href="tel:${soNumeros(v.telefone)}">${v.telefone}</a>
      <a href="mailto:${v.email}">${v.email}</a>
    </div>
    <a class="btn sm" href="https://wa.me/${v.whatsapp}" target="_blank" rel="noopener">Chamar no WhatsApp</a>
  </article>`).join("");