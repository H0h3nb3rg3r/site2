import "./comum.js";
import { LOJA } from "./loja.js";

const $ = (s) => document.querySelector(s);
const q = encodeURIComponent(LOJA.mapa);

$("#mapa").src = `https://www.google.com/maps?q=${q}&output=embed`;
$("#rota").href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
$("#endereco").textContent = `${LOJA.endereco} — ${LOJA.cidade}`;
$("#tel").textContent = LOJA.telefone;
$("#tel").href = `tel:${LOJA.telefone.replace(/\D/g, "")}`;
$("#zap").href = `https://wa.me/${LOJA.whatsapp}`;
$("#email").textContent = LOJA.email;
$("#email").href = `mailto:${LOJA.email}`;
$("#horario").innerHTML = LOJA.horario.map(([d, h]) => `<li><span>${d}</span><b>${h}</b></li>`).join("");

// Galeria: se a foto não existir, fica só o fundo com a legenda
$("#galeria").innerHTML = LOJA.fotos.map(([src, legenda]) => `
  <figure class="foto-loja">
    <img src="${src}" alt="${legenda}" loading="lazy" onerror="this.remove()">
    <figcaption>${legenda}</figcaption>
  </figure>`).join("");

// Ampliar a foto ao clicar
const lb = $("#lb");
$("#galeria").addEventListener("click", (e) => {
  const img = e.target.closest(".foto-loja")?.querySelector("img");
  if (!img) return;
  lb.querySelector("img").src = img.src;
  lb.hidden = false;
});
lb.addEventListener("click", () => (lb.hidden = true));
addEventListener("keydown", (e) => e.key === "Escape" && (lb.hidden = true));