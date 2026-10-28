import "./comum.js";
import { quandoLogar, usuario, cadastrar, entrar, sair, recuperarSenha, perfil, erroAuth } from "./auth.js";
import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { brl } from "./dados.js";

const $ = (s) => document.querySelector(s);
const raiz = $("#conta");
let ocupado = false;

const esc = (t = "") => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const dataBR = (s = "") => s.split("-").reverse().join("/");
const titulo = (h, sub) => {
  $("#tituloConta").innerHTML = h;
  $("#subConta").textContent = sub;
};

// ---------- Tela de login / cadastro ----------
function telaLogin() {
  titulo(`Entre na sua <span>conta</span>`, "Você pode comprar e agendar sem conta, mas com ela tudo fica guardado para você.");
  raiz.innerHTML = `
    <div class="auth">
      <div class="auth-info">
        <h2>Vantagens da <span>conta</span></h2>
        <ul>
          <li>Histórico de todos os seus test-drives</li>
          <li>Acompanhe o status dos seus pedidos</li>
          <li>Seus dados preenchidos automaticamente</li>
          <li>Tudo guardado com segurança, a qualquer hora</li>
        </ul>
      </div>
      <div class="td-form">
        <div class="abas">
          <button type="button" class="on" data-aba="entrar">Entrar</button>
          <button type="button" data-aba="criar">Criar conta</button>
        </div>

        <form id="fEntrar">
          <input name="email" type="email" placeholder="E-mail" autocomplete="email" required>
          <input name="senha" type="password" placeholder="Senha" autocomplete="current-password" required>
          <button class="btn" type="submit">Entrar</button>
          <button type="button" class="btn-link" id="esqueci">Esqueci minha senha</button>
        </form>

        <form id="fCriar" hidden>
          <input name="nome" placeholder="Nome completo" autocomplete="name" required>
          <input name="telefone" type="tel" placeholder="WhatsApp" autocomplete="tel" required>
          <input name="email" type="email" placeholder="E-mail" autocomplete="email" required>
          <div class="dupla">
            <input name="senha" type="password" placeholder="Senha (mín. 6)" minlength="6" autocomplete="new-password" required>
            <input name="senha2" type="password" placeholder="Repita a senha" minlength="6" autocomplete="new-password" required>
          </div>
          <button class="btn" type="submit">Criar minha conta</button>
        </form>

        <p class="msg" id="msg"></p>
      </div>
    </div>`;

  const msg = (t, ok) => {
    $("#msg").style.color = ok ? "#4ade80" : "#ff2a3d";
    $("#msg").textContent = t;
  };

  document.querySelectorAll(".abas button").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll(".abas button").forEach((x) => x.classList.toggle("on", x === b));
    $("#fEntrar").hidden = b.dataset.aba !== "entrar";
    $("#fCriar").hidden = b.dataset.aba !== "criar";
    msg("");
  }));

  $("#fEntrar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    msg("Entrando...", true);
    try {
      await entrar(f.email.trim(), f.senha);
    } catch (err) {
      msg(erroAuth(err));
    }
  });

  $("#fCriar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    if (f.senha !== f.senha2) return msg("As senhas não conferem.");
    ocupado = true;
    msg("Criando sua conta...", true);
    try {
      await cadastrar({ nome: f.nome.trim(), telefone: f.telefone.trim(), email: f.email.trim(), senha: f.senha });
    } catch (err) {
      ocupado = false;
      return msg(erroAuth(err));
    }
    ocupado = false;
    telaConta(usuario());
  });

  $("#esqueci").addEventListener("click", async () => {
    const email = $("#fEntrar").elements.email.value.trim();
    if (!email) return msg("Digite seu e-mail acima para receber o link.");
    try {
      await recuperarSenha(email);
      msg("Enviamos um link para redefinir a senha no seu e-mail.", true);
    } catch (err) {
      msg(erroAuth(err));
    }
  });
}

// ---------- Tela da conta (logado) ----------
async function buscar(col, uid) {
  const s = await getDocs(query(collection(db, col), where("uid", "==", uid)));
  return s.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.criadoEm?.seconds || 0) - (a.criadoEm?.seconds || 0));
}

const vazio = (txt, link, rotulo) => `<p class="aviso">${txt} <a href="${link}" style="color:var(--red)">${rotulo}</a></p>`;

async function telaConta(u) {
  const nome = u.displayName || u.email.split("@")[0];
  const iniciais = nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  titulo(`Olá, <span>${esc(nome.split(" ")[0])}</span>`, "Aqui fica tudo o que você fez na VELOCE Motors.");

  raiz.innerHTML = `
    <div class="conta-topo">
      <div class="conta-id">
        <div class="conta-avatar">${esc(iniciais)}</div>
        <div><h3>${esc(nome)}</h3><p id="dadosConta">${esc(u.email)}</p></div>
      </div>
      <button class="btn ghost" id="sair" type="button">Sair da conta</button>
    </div>

    <h2>Meus <span>test-drives</span></h2>
    <div class="reg" id="regTD"><p class="aviso">Carregando...</p></div>

    <h2>Meus <span>pedidos</span></h2>
    <div class="reg" id="regPed"><p class="aviso">Carregando...</p></div>`;

  $("#sair").addEventListener("click", () => sair());

  try {
    const [p, tds, peds] = await Promise.all([
      perfil(u.uid).catch(() => ({})),
      buscar("agendamentos", u.uid),
      buscar("pedidos", u.uid),
    ]);
    if (p.telefone) $("#dadosConta").textContent = `${u.email} · ${p.telefone}`;

    $("#regTD").innerHTML = tds.length
      ? tds.map((t) => `
        <div class="reg-item">
          <div>
            <h3>${esc(t.carro)}</h3>
            <p>${esc(t.teste || "Test-drive")}${t.cor ? ` · ${esc(t.cor)}` : ""} · ${esc(dataBR(t.data))}${t.horario ? ` às ${esc(t.horario)}` : ""}</p>
          </div>
          <span class="selo-status">Agendado</span>
        </div>`).join("")
      : vazio("Você ainda não agendou nenhum test-drive.", "/test-drive.html", "Agendar agora");

    $("#regPed").innerHTML = peds.length
      ? peds.map((p) => `
        <div class="reg-item">
          <div>
            <h3>${esc(p.carro)}${p.cor ? ` · ${esc(p.cor)}` : ""}</h3>
            <p>Pedido ${esc(p.id.slice(0, 8).toUpperCase())} · ${p.entrega === "casa" ? "Entrega em casa" : "Retirada na loja"} · ${brl(p.total || 0)}</p>
          </div>
          <span class="selo-status">${esc(p.status || "em análise")}</span>
        </div>`).join("")
      : vazio("Você ainda não fez nenhum pedido.", "/estoque.html", "Ver estoque");
  } catch (err) {
    console.error(err);
    $("#regTD").innerHTML = $("#regPed").innerHTML = `<p class="aviso">Não foi possível carregar seu histórico agora.</p>`;
  }
}

quandoLogar((u) => {
  if (ocupado) return;
  u ? telaConta(u) : telaLogin();
});