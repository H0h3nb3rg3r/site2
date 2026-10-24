import { mkdir, writeFile, access } from "node:fs/promises";

// arquivo, legenda, buscas (tenta em ordem até achar)
const fotos = [
  ["1.jpg", "Showroom", [
    "luxury car showroom interior",
    "exotic car dealership showroom",
    "supercar showroom",
  ]],
  ["2.jpg", "Supercarros", [
    "supercars dealership lineup",
    "exotic cars showroom Lamborghini Ferrari McLaren",
    "supercar collection garage",
  ]],
  ["3.jpg", "Lounge VIP", [
    "luxury lounge interior",
    "vip lounge leather sofa",
    "luxury hotel lounge",
  ]],
  ["4.jpg", "Fachada", [
    "luxury car dealership building",
    "Lamborghini dealership exterior",
    "McLaren showroom exterior",
  ]],
  ["5.jpg", "Entrega do carro", [
    "new car keys handover",
    "car delivery customer keys",
    "handing over car keys",
  ]],
  ["6.jpg", "Nossa equipe", [
    "business team suits office",
    "sales team dealership",
    "corporate team portrait",
  ]],
];

const pasta = "public/loja";
const UA = { "User-Agent": "VeloceSite/1.0 (projeto pessoal)" };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const existe = (p) => access(p).then(() => true, () => false);

async function buscar(termo) {
  const url = new URL("https://api.openverse.org/v1/images/");
  url.searchParams.set("q", termo);
  url.searchParams.set("category", "photograph");
  url.searchParams.set("aspect_ratio", "wide");
  url.searchParams.set("size", "large");
  url.searchParams.set("license_type", "commercial");
  url.searchParams.set("extension", "jpg");
  url.searchParams.set("page_size", "20");
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`Openverse HTTP ${r.status}`);
  const j = await r.json();
  const boas = (j.results ?? []).filter((i) => (i.width ?? 0) >= 1200 && i.url);
  const top = boas.slice(0, 6);
  // sorteia entre as melhores; ao rodar de novo pode vir outra
  return top[Math.floor(Math.random() * top.length)];
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
      const img = await fetch(f.url, { headers: UA });
      if (!img.ok) throw new Error(`HTTP ${img.status}`);
      await writeFile(destino, Buffer.from(await img.arrayBuffer()));
      creditos.push(`${legenda} (${arquivo}): ${f.creator ?? "?"} | ${f.license ?? ""} ${f.license_version ?? ""} | ${f.foreign_landing_url}`);
      console.log(`ok: ${legenda} -> ${arquivo}  [${f.title}]`);
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