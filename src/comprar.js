import "./comum.js";
import { carregarCarros, brl } from "./dados.js";
import { LOJA, SINAL, FRETE } from "./loja.js";
import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const $ = (s) => document.querySelector(s);
const horarios = ["09:00", "10:30", "14:00", "15:30", "17:00"];
let car = null, sel = {};

function resumo() {
  const frete = sel.entrega === "casa" ? FRETE : 0;
  const sinal = Math.round(car.preco * SINAL);
  $("#resumo").innerHTML = `
    <div class="linha"><span>Valor do veículo</span><b>${brl(car.preco)}</b></div>
    <div class="linha"><span>Entrega em casa</span><b>${sel.entrega === "casa" ? brl(frete) : sel.entrega ? "Grátis (retirada)" : "—"}</b></div>
    <div class="linha total"><span>Total do pedido</span><b>${brl(car.preco + frete)}</b></div>
    <div class="sinal">Sinal de reserva (${Math.round(SINAL * 100)}%): <strong>${brl(sinal)}</strong><br>O restante é pago na retirada ou entrega, ou financiado.</div>`;
}

function blocos() {
  const retirada = sel.entrega === "retirada", casa = sel.entrega === "casa";
  $("#blocoRetirada").hidden = !retirada;
  $("#blocoCasa").hidden = !casa;
  $("#data").required = retirada;
  ["cep", "cidade", "endereco"].forEach((n) => ($(`[name=${n}]`).required = casa));
  resumo();
}

// Chips (entrega, pagamento, horário)
document.addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  b.parentElement.querySelectorAll(".chip").forEach((x) => x.classList.toggle("on", x === b));
  sel[b.dataset.k] = b.dataset.v || b.textContent;
  if (b.dataset.k === "entrega") blocos();
});

// Máscara do CPF
$("#cpf").addEventListener("input", (e) => {
  const d = e.target.value.replace(/\D/g, "").slice(0, 11);
  e.target.value = d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
});

$("#data").min = new Date().toISOString().split("T")[0];

$("#form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const st = $("#status"), btn = e.target.querySelector("button[type=submit]");
  const f = Object.fromEntries(new FormData(e.target));
  const cpf = f.cpf.replace(/\D/g, "");
  st.style.color = "#ff2a3d";

  if (!sel.entrega) return (st.textContent = "Escolha como deseja receber o carro.");
  if (sel.entrega === "retirada" && !sel.horario) return (st.textContent = "Escolha o horário da retirada.");
  if (!sel.pagamento) return (st.textContent = "Escolha a forma de pagamento.");
  if (cpf.length !== 11) return (st.textContent = "Confira o CPF.");

  btn.disabled = true;
  st.style.color = "";
  st.textContent = "Enviando pedido...";
  const frete = sel.entrega === "casa" ? FRETE : 0;
  try {
    const ref = await addDoc(collection(db, "pedidos"), {
      carroId: car.id,
      carro: car.nome,
      preco: car.preco,
      entrega: sel.entrega,
      frete,
      sinal: Math.round(car.preco * SINAL),
      total: car.preco + frete,
      pagamento: sel.pagamento,
      retiradaData: sel.entrega === "retirada" ? f.data : "",
      retiradaHorario: sel.entrega === "retirada" ? sel.horario : "",
      cep: f.cep || "",
      cidade: f.cidade || "",
      endereco: f.endereco || "",
      nome: f.nome,
      cpf,
      email: f.email,
      telefone: f.telefone,
      status: "aguardando contato",
      criadoEm: serverTimestamp(),
    });
    const proximo = sel.entrega === "retirada"
      ? `Sua retirada está marcada para ${f.data.split("-").reverse().join("/")} às ${sel.horario}, na ${LOJA.endereco}.`
      : "Entraremos em contato para combinar a data da entrega no seu endereço.";
    $("#form").innerHTML = `
      <div class="pedido-ok">
        <div class="selo">✓</div>
        <h2>Pedido recebido!</h2>
        <div class="codigo">${ref.id.slice(0, 8).toUpperCase()}</div>
        <p>${proximo} Em até 2 horas nossa equipe envia os dados seguros para o pagamento do sinal.</p>
        <div class="cta">
          <a class="btn" href="/">Voltar ao início</a>
          <a class="btn ghost" href="/loja.html">Ver a loja</a>
        </div>
      </div>`;
    scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    st.style.color = "#ff2a3d";
    st.textContent = "Erro ao enviar o pedido. Tente novamente.";
    console.error(err);
    btn.disabled = false;
  }
});

carregarCarros().then((cars) => {
  const id = new URLSearchParams(location.search).get("id");
  car = cars.find((c) => c.id === id);
  if (!car) {
    $("main").innerHTML = `<div class="vazio" style="grid-column:1/-1">Carro não encontrado. <a href="/estoque.html" style="color:var(--red)">Voltar ao estoque</a></div>`;
    return;
  }
  document.title = `Comprar ${car.nome} | VELOCE Motors`;
  $("#foto").style.setProperty("--h", car.h);
  $("#foto").innerHTML = `<svg viewBox="0 0 300 100"><use href="#car"/></svg>` +
    (car.img ? `<img src="${car.img}" alt="${car.nome}" onerror="this.remove()">` : "");
  $("#info").innerHTML = `<span class="tag">${car.tipo}</span><h3>${car.nome}</h3>
    <div class="specs"><div><b>${car.cv}</b>cv</div><div><b>${car.s}s</b>0–100</div><div><b>${car.ano}</b>ano</div></div>`;
  $("#enderecoLoja").textContent = `Retirada em: ${LOJA.endereco} — ${LOJA.cidade}`;
  $("#horarios").innerHTML = horarios.map((h) => `<button type="button" class="chip" data-k="horario">${h}</button>`).join("");
  resumo();
});