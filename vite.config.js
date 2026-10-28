import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const pagina = (arq) => fileURLToPath(new URL(arq, import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: pagina("./index.html"),
        estoque: pagina("./estoque.html"),
        testdrive: pagina("./test-drive.html"),
        carro: pagina("./carro.html"),
        loja: pagina("./loja.html"),
        comprar: pagina("./comprar.html"),
        historia: pagina("./historia.html"),
        contato: pagina("./contato.html"),
        conta: pagina("./conta.html"),
      },
    },
  },
});