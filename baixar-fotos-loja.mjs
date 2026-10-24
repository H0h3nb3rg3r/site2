import { mkdir, writeFile, access } from "node:fs/promises";

// arquivo, legenda, buscas (tenta em ordem até achar uma foto boa, SEM carros)
const fotos = [
  ["1.jpg", "Showroom", [
    "luxury boutique store interior",
    "luxury showroom interior design",
    "modern luxury retail store interior",
  ]],
  ["2.jpg", "Supercarros", [
    "luxury garage interior lighting",
    "modern underground parking luxury design",
    "premium exhibition hall interior",
  ]],
  ["3.jpg", "Lounge VIP",  [
    "luxury lounge interior",
    "VIP lounge interior design",
    "hotel lobby lounge luxury",
  ]],
  ["4.jpg", "Fachada", [
    "modern glass building facade night",
    "luxury modern building exterior glass",
    "contemporary commercial building facade",
  ]],
  ["5.jpg", "Entrega do carro", [
    "handshake business deal keys",
    "handing over keys handshake",
    "business handshake office",
  ]],
  ["6.jpg", "Nossa equipe", [
    "business team standing office suits",
    "team of professionals group photo office",
    "corporate team portrait",
  ]],
];

// Palavras que eliminam qualquer resultado com carro
const SEM_CARRO = "-car -cars -automobile -vehicle -supercar -ferrari -lamborghini -porsche -mclaren -bmw -mercedes -audi -motor";

const pasta = "public/loja";
const UA = { "User-Agent": "VeloceSite/1.0 (projeto pessoal)" };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const existe = (p) => access(p).then(() => true, () => false);
const limpa = (h = "") => h.replace(/<[^>]+>/g, "").trim();
const CARRO = /\b(car|cars|auto|automobile|vehicle|supercar|ferrari|lamborghini|porsche|mclaren|bmw|mercedes|audi|bentley|maserati|aston|nissan|corvette|tesla|motor)\b/i;

async function buscar(termo) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  const params = {
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrsearch: `${termo} ${SEM_CARRO} filetype:bitmap`,
    gsrlimit: "40",
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "1400",
  };
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const j = await (await fetch(url, { headers: UA })).json();
  const paginas = Object.values(j.query?.pages ?? {}).sort((a, b) => a.index - b.index);
  return paginas
    .map((p) => ({ titulo: p.title, ...p.imageinfo?.[0] }))
    .filter((i) => !CARRO.test(i.titulo) && !CARRO.test(limpa(i.extmetadata?.ImageDescription?.value)))
    .find((i) => i.mime === "image/jpeg" && i.width >= 1200 && i.width > i.height * 1.2);
}

await mkdir(pasta, { recursive: true });
const creditos = [];

for (const [arquivo, legenda, buscas] of fotos) {
  const destino = `${pasta}/${arquivo}`;
  if (await existe(destino)) {
    console.log(`já existe: ${arquivo} (${legenda})`);
    continue;
  }
  let achou = false;
  for (const termo of buscas) {
    try {
      const f = await buscar(termo);
      if (!f) {
        await espera(1000);
        continue;
      }
      const img = await fetch(f.thumburl, { headers: UA });
      if (!img.ok) throw new Error(`HTTP ${img.status}`);
      await writeFile(destino, Buffer.from(await img.arrayBuffer()));
      const m = f.extmetadata ?? {};
      creditos.push(`${legenda} (${arquivo}): ${limpa(m.Artist?.value)} | ${m.LicenseShortName?.value ?? ""} | ${f.descriptionurl}`);
      console.log(`ok: ${legenda} -> ${arquivo}  [${f.titulo}]`);
      achou = true;
      break;
    } catch (err) {
      console.log(`ERRO em "${termo}": ${err.message}`);
    }
    await espera(1200);
  }
  if (!achou) console.log(`SEM FOTO: ${legenda} (coloque manualmente em ${destino})`);
  await espera(1200);
}

if (creditos.length) {
  await writeFile(`${pasta}/creditos.txt`, creditos.join("\n") + "\n", { flag: "a" });
}
console.log("Pronto! Confira as fotos em public/loja/");