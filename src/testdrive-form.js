import { brl } from "./dados.js";
import { db } from "./firebase.js";
import { uidAtual, ligarContaAoForm } from "./auth.js";
import { avisarLoja } from "./notificar.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const $ = (s) => document.querySelector(s);
const horarios = ["09:00", "10:30", "14:00", "15:30", "17:00"];
const semFoto = "Escolha um carro para ver a foto";

// Formulário de test-drive usado na página inicial e na página de test-drive
export function iniciarTestDrive(cars) {
  let car = null, sel = {};

  const chips = (id, lista, k) => {
    $(id).innerHTML = lista.map((v) => `<button type="button" class="chip" data-k="${k}">${v}</button>`).join("");
  };

  function escolher(nome) {
    car = cars.find((c) => c.nome === nome) || null;
    sel = {};
    $("#carroSel").value = car ? car.nome : "";
    $("#form").classList.toggle("sem-carro", !car);
    if (!car) {
      $("#foto").innerHTML = semFoto;
      $("#info").innerHTML = "";
      ["#testes", "#cores", "#horarios"].forEach((id) => ($(id).innerHTML = ""));
      return;
    }
    $("#foto").style.setProperty("--h", car.h);
    $("#foto").innerHTML = `<svg viewBox="0 0 300 100"><use href="#car"/></svg>` +
      (car.img ? `<img src="${car.img}" alt="${car.nome}" onerror="this.remove()">` : "");
    $("#info").innerHTML = `
      <span class="tag">${car.tipo}</span>
      <h3>${car.nome}</h3>
      <div class="specs"><div><b>${car.cv}</b>cv</div><div><b>${car.s}s</b>0–100</div></div>
      <div class="price">${brl(car.preco)}</div>`;
    chips("#testes", car.testes, "teste");
    chips("#cores", car.cores, "cor");
    chips("#horarios", horarios, "horario");
  }

  // Seleção das opções (chips)
  $("#form").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    b.parentElement.querySelectorAll(".chip").forEach((x) => x.classList.toggle("on", x === b));
    sel[b.dataset.k] = b.textContent;
  });

  $("#carroSel").innerHTML = `<option value="">Escolha o carro</option>` + cars.map((c) => `<option>${c.nome}</option>`).join("");
  $("#carroSel").addEventListener("change", (e) => escolher(e.target.value));
  $("#data").min = new Date().toISOString().split("T")[0];

  // Conta: aviso e preenchimento automático dos dados
  ligarContaAoForm($("#form"));

  // Envio para o Firestore
  $("#form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const st = $("#status"), btn = e.target.querySelector("button[type=submit]");
    st.style.color = "#ff2a3d";
    if (!car || !sel.teste || !sel.cor || !sel.horario) {
      st.textContent = "Escolha o tipo de test-drive, a cor e o horário.";
      return;
    }
    btn.disabled = true;
    st.style.color = "";
    st.textContent = "Enviando...";
    try {
      const f = Object.fromEntries(new FormData(e.target));
      await addDoc(collection(db, "agendamentos"), {
        carro: car.nome,
        teste: sel.teste,
        cor: sel.cor,
        horario: sel.horario,
        data: f.data,
        nome: f.nome,
        telefone: f.telefone,
        mensagem: f.mensagem || "",
        ...(uidAtual() ? { uid: uidAtual() } : {}),
        criadoEm: serverTimestamp(),
      });

      // Aviso por e-mail para a loja (não espera a resposta)
      avisarLoja(`Novo test-drive: ${car.nome} - ${f.nome}`, [
        ["Carro", car.nome],
        ["Tipo de test-drive", sel.teste],
        ["Cor", sel.cor],
        ["Data", f.data.split("-").reverse().join("/")],
        ["Horário", sel.horario],
        ["Nome", f.nome],
        ["WhatsApp", f.telefone],
        ["Mensagem", f.mensagem],
        ["Cliente com conta", uidAtual() ? "Sim" : "Não"],
      ]);

      st.style.color = "#4ade80";
      st.textContent = uidAtual()
        ? "Test-drive agendado! Ele já está na sua conta."
        : "Test-drive agendado! Entraremos em contato para confirmar.";
      e.target.reset();
      escolher("");
    } catch (err) {
      st.style.color = "#ff2a3d";
      st.textContent = "Erro ao enviar. Tente novamente.";
      console.error(err);
    }
    btn.disabled = false;
  });

  return { escolher };
}