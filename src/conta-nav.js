import "./legal.js";
import { auth, quandoLogar } from "./auth.js";

const nav = document.querySelector("#nav nav");

if (nav) {
  const a = document.createElement("a");
  a.href = "/conta.html";
  a.className = "btn sm ghost";
  a.textContent = "Entrar";
  nav.insertBefore(a, nav.querySelector("a.btn"));

  const rotulo = () => {
    const u = auth.currentUser;
    a.textContent = u ? `Olá, ${(u.displayName || u.email).split(/[ @]/)[0]}` : "Entrar";
  };
  quandoLogar(rotulo);
  addEventListener("conta-atualizada", rotulo);
}