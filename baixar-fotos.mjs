import { mkdir, writeFile, access } from "node:fs/promises";

const carros = [
  ["ferrari-296", "Ferrari 296 GTB"],
  ["lamborghini-huracan", "Lamborghini Huracán"],
  ["mclaren-720s", "McLaren 720S Spider"],
  ["porsche-911-gt3", "Porsche 911 GT3"],
  ["aston-martin-vantage", "Aston Martin Vantage"],
  ["maserati-mc20", "Maserati MC20 Cielo"],
  ["ferrari-roma", "Ferrari Roma"],
  ["lamborghini-urus", "Lamborghini Urus"],
  ["porsche-taycan", "Porsche Taycan Turbo S"],
  ["audi-r8", "Audi R8 V10"],
  ["bmw-m4", "BMW M4 Competition"],
  ["mercedes-amg-gt", "Mercedes-AMG GT 63 S"],
  ["mclaren-artura", "McLaren Artura"],
  ["ferrari-portofino", "Ferrari Portofino M"],
  ["porsche-911-turbo-cabrio", "Porsche 911 Turbo S Cabriolet"],
  ["bentley-continental-gt", "Bentley Continental GT Speed"],
  ["nissan-gtr", "Nissan GT-R Nismo"],
  ["corvette-z06", "Chevrolet Corvette Z06"],
  ["mercedes-amg-sl63", "Mercedes-AMG SL 63"],
  ["bmw-x5m", "BMW X5 M Competition"],
  ["koenigsegg-jesko", "Koenigsegg Jesko"],
  ["koenigsegg-gemera", "Koenigsegg Gemera"],
  ["bugatti-chiron", "Bugatti Chiron"],
  ["pagani-huayra", "Pagani Huayra"],
  ["rimac-nevera", "Rimac Nevera"],
  ["ferrari-sf90", "Ferrari SF90 Stradale"],
  ["lamborghini-revuelto", "Lamborghini Revuelto"],
  ["mclaren-765lt", "McLaren 765LT"],
  ["aston-martin-db12", "Aston Martin DB12"],
  ["rolls-royce-spectre", "Rolls-Royce Spectre"],
  ["lotus-emira", "Lotus Emira"],
  ["ford-gt", "Ford GT"],
];

const pasta = "public/carros";
const UA = { "User-Agent": "VeloceSite/1.0 (projeto pessoal)" };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const existe = (p) => access(p).then(() => true, () => false);
const limpa = (h = "") => h.replace(/<[^>]+>/g, "").trim();

async function buscar(nome) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  const params = {
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrsearch: `${nome} -interior -engine -logo`,
    gsrlimit: "20",
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "1400",
  };
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const j = await (await fetch(url, { headers: UA })).json();
  const paginas = Object.values(j.query?.pages ?? {}).sort((a, b) => a.index - b.index);
  return paginas
    .map((p) => ({ titulo: p.title, ...p.imageinfo?.[0] }))
    .find((i) => i.mime === "image/jpeg" && i.width >= 1400 && i.width > i.height * 1.3);
}

await mkdir(pasta, { recursive: true });
const creditos = [];

for (const [id, nome] of carros) {
  const destino = `${pasta}/${id}.jpg`;
  if (await existe(destino)) {
    console.log(`já existe: ${id}`);
    continue;
  }
  try {
    const f = await buscar(nome);
    if (!f) {
      console.log(`SEM FOTO: ${nome} (coloque manualmente em ${destino})`);
      continue;
    }
    const img = await fetch(f.thumburl, { headers: UA });
    if (!img.ok) throw new Error(`HTTP ${img.status}`);
    await writeFile(destino, Buffer.from(await img.arrayBuffer()));
    const m = f.extmetadata ?? {};
    creditos.push(`${nome}: ${limpa(m.Artist?.value)} | ${m.LicenseShortName?.value ?? ""} | ${f.descriptionurl}`);
    console.log(`ok: ${nome}`);
  } catch (err) {
    console.log(`ERRO: ${nome} (${err.message})`);
  }
  await espera(1200);
}

if (creditos.length) {
  await writeFile(`${pasta}/creditos.txt`, creditos.join("\n") + "\n", { flag: "a" });
}
console.log("Pronto! Confira as fotos em public/carros/");