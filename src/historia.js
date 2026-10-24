import "./comum.js";
import { HISTORIA, VALORES } from "./marca.js";

const $ = (s) => document.querySelector(s);

$("#linha").innerHTML = HISTORIA.map((h, i) => `
  <div class="marco">
    <div class="marco-num">${h.ano || String(i + 1).padStart(2, "0")}</div>
    <div class="marco-txt">
      <h3>${h.titulo}</h3>
      <p>${h.texto}</p>
    </div>
  </div>`).join("");

$("#valores").innerHTML = VALORES.map((v) => `
  <div class="valor">
    <h3>${v.titulo}</h3>
    <p>${v.texto}</p>
  </div>`).join("");