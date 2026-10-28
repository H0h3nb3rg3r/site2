import "./comum.js";
import { dados } from "./empresa.js";

// Preenche os campos marcados com data-e="..." usando os dados da empresa
document.querySelectorAll("[data-e]").forEach((el) => {
  const valor = dados[el.dataset.e] ?? "";
  el.textContent = valor;
  if (el.tagName === "A" && el.dataset.e.startsWith("email")) el.href = `mailto:${valor}`;
});