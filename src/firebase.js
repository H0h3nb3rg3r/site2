import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBPigYuzjWhy60sZTs96FVEAMgX9rm01g",
  authDomain: "site-92a97.firebaseapp.com",
  projectId: "site-92a97",
  storageBucket: "site-92a97.firebasestorage.app",
  messagingSenderId: "443439005339",
  appId: "1:443439005339:web:ffd008cd9b05175fd7103e",
  measurementId: "G-JK8M4LGFNX"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// O Analytics só liga depois que o visitante aceita os cookies (veja legal.js)
let analyticsLigado = false;
async function ligarAnalytics() {
  if (analyticsLigado) return;
  analyticsLigado = true;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (await isSupported()) getAnalytics(app);
}

// Exporta para usar em outros arquivos do seu projeto
export { app, db, ligarAnalytics };