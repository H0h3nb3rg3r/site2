import { LOJA } from "./loja.js";
import { EMPRESA } from "./empresa.js";
import { ligarAnalytics } from "./firebase.js";

const CHAVE = "veloce-cookies";

const ler = () => {
  try { return JSON.parse(localStorage.getItem(CHAVE)); } catch { return null; }
};
const gravar = (analytics) => {
  try { localStorage.setItem(CHAVE, JSON.stringify({ analytics, em: new Date().toISOString() })); } catch {}
};

// Apaga os cookies do Google Analytics quando o visitante revoga o consentimento
function limparCookiesGA() {
  const raiz = location.hostname.split(".").slice(-2).join(".");
  document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => n.startsWith("_ga")).forEach((n) => {
    ["", `domain=${location.hostname};`, `domain=.${raiz};`].forEach((d) => {
      document.cookie = `${n}=; Max-Age=0; path=/; ${d}`;
    });
  });
}

const fechar = () => document.querySelector("#cookies")?.remove();

function abrirBanner() {
  fechar();
  const el = document.createElement("div");
  el.id = "cookies";
  el.className = "cookies";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", "Preferências de cookies");
  el.innerHTML = `
    <h4>Sua privacidade</h4>
    <p>Usamos armazenamento essencial para o site e a sua conta funcionarem. Com a sua permissão, usamos também o Google Analytics para entender como o site é usado. Você pode mudar de ideia quando quiser, em "Preferências de cookies", no rodapé. <a href="/privacidade.html#cookies">Saiba mais</a></p>
    <div class="cookies-btns">
      <button type="button" class="btn sm ghost" data-c="nao">Recusar</button>
      <button type="button" class="btn sm ghost" data-c="sim">Aceitar analytics</button>
    </div>`;
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-c]");
    if (!b) return;
    const aceitou = b.dataset.c === "sim";
    const tinha = ler()?.analytics === true;
    gravar(aceitou);
    fechar();
    if (aceitou && !tinha) ligarAnalytics();
    if (!aceitou && tinha) {
      limparCookiesGA();
      location.reload();
    }
  });
  document.body.append(el);
}

// Rodapé com identificação da empresa e links legais
const rodape = document.querySelector("footer");
if (rodape) {
  rodape.insertAdjacentHTML("beforeend", `
    <div class="rodape-legal">
      <p>${EMPRESA.razao} · CNPJ ${EMPRESA.cnpj} · ${LOJA.endereco} — ${LOJA.cidade}</p>
      <div class="rodape-links">
        <a href="/privacidade.html">Política de Privacidade</a>
        <a href="/termos.html">Termos de reserva e compra</a>
        <a href="/carros/creditos.txt" target="_blank" rel="noopener">Créditos das imagens</a>
        <button type="button" id="prefCookies">Preferências de cookies</button>
      </div>
    </div>`);
  document.querySelector("#prefCookies").addEventListener("click", abrirBanner);
}

// Só liga o Analytics se o visitante já aceitou antes; sem escolha, mostra o banner
const escolha = ler();
if (escolha?.analytics) ligarAnalytics();
else if (!escolha) abrirBanner();