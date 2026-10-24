import { mkdir, writeFile, access } from "node:fs/promises";

// arquivo, legenda, buscas (tenta em ordem até achar uma foto boa)
const fotos = [
  ["1.jpg", "Showroom", [
    "luxury car showroom interior",
    "car dealership showroom interior",
    "Ferrari showroom",
  ]],
  ["2.jpg", "Supercarros", [
    "supercars lined up garage",
    "Lamborghini Ferrari supercars parked",
    "supercar collection",
  ]],
  ["3.jpg", "Lounge VIP", [
    "luxury lounge interior",
    "VIP lounge interior design",
    "hotel lobby lounge luxury",
  ]],
  ["4.jpg", "Fachada", [
    "luxury car dealership building facade",
    "Lamborghini dealership building",
    "Porsche center building exterior",
  ]],
  ["5.jpg", "Entrega do carro", [
    "car delivery handing over keys",
    "new car handover keys customer",
    "car keys handover dealership",
  ]],
  ["6.jpg", "Nossa equipe", [
    "business team standing office suits",
    "sales team dealership staff",
    "team of professionals group photo office",
  ]],
];

const pasta = "public/loja";
const UA = { "User-Agent": "VeloceSite/1.0 (projeto pessoal)" };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const existe = (p) => access(p).then(() => true, () => false);
const limpa = (h = "") => h.replace(/<[^>]+>/g, "").trim();

async function buscar(termo) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  const params = {
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrsearch: `${termo} filetype:bitmap`,
    gsrlimit: "30",
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "1400",
  };
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const j = await (await fetch(url, { headers: UA })).json();
  const paginas = Object.values(j.query?.pages ?? {}).sort((a, b) => a.index - b.index);
  return paginas
    .map((p) => ({ titulo: p.title, ...p.imageinfo?.[0] }))
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