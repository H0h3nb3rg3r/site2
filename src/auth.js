import { app, db } from "./firebase.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export const auth = getAuth(app);

export const quandoLogar = (cb) => onAuthStateChanged(auth, cb);
export const usuario = () => auth.currentUser;
export const uidAtual = () => auth.currentUser?.uid || null;

export async function cadastrar({ nome, telefone, email, senha }) {
  const { user } = await createUserWithEmailAndPassword(auth, email, senha);
  await updateProfile(user, { displayName: nome });
  await setDoc(doc(db, "usuarios", user.uid), { nome, telefone, email, criadoEm: serverTimestamp() })
    .catch((err) => console.warn("Perfil não salvo:", err.message));
  dispatchEvent(new Event("conta-atualizada"));
  return user;
}

export const entrar = (email, senha) => signInWithEmailAndPassword(auth, email, senha);
export const sair = () => signOut(auth);
export const recuperarSenha = (email) => sendPasswordResetEmail(auth, email);

export async function perfil(uid) {
  const s = await getDoc(doc(db, "usuarios", uid));
  return s.exists() ? s.data() : {};
}

const ERROS = {
  "auth/email-already-in-use": "Este e-mail já tem cadastro. Entre na sua conta.",
  "auth/invalid-email": "E-mail inválido.",
  "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/wrong-password": "E-mail ou senha incorretos.",
  "auth/user-not-found": "E-mail ou senha incorretos.",
  "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente de novo.",
  "auth/network-request-failed": "Sem conexão. Verifique sua internet.",
  "auth/operation-not-allowed": "O login por e-mail ainda não foi ativado no Firebase.",
  "auth/configuration-not-found": "O login por e-mail ainda não foi ativado no Firebase.",
};
export const erroAuth = (err) => ERROS[err.code] || "Não foi possível concluir. Tente novamente.";

// Nos formulários: avisa se há conta e preenche nome, e-mail e WhatsApp
export function ligarContaAoForm(form) {
  const aviso = document.createElement("p");
  aviso.className = "aviso";
  form.querySelector("button[type=submit]").before(aviso);
  quandoLogar(async (u) => {
    if (!u) {
      aviso.innerHTML = `Quer guardar isto na sua conta? <a href="/conta.html" style="color:var(--red)">Entre ou crie uma conta</a> (opcional).`;
      return;
    }
    aviso.innerHTML = `Logado como <b>${u.displayName || u.email}</b>. Este registro ficará salvo na sua conta.`;
    const p = await perfil(u.uid).catch(() => ({}));
    const dados = { nome: p.nome || u.displayName, email: u.email, telefone: p.telefone };
    for (const [n, v] of Object.entries(dados)) {
      const campo = form.elements[n];
      if (campo && v && !campo.value) campo.value = v;
    }
  });
}