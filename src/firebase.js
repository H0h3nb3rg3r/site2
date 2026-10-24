import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Exporta para usar em outros arquivos do seu projeto
export { app, db };