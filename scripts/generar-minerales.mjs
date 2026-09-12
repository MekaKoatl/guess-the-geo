// scripts/generar-minerales.mjs

import { writeFileSync } from "node:fs";

const ENDPOINT = "https://query.wikidata.org/sparql";

// --- Consulta de MINERALES (especies, variedades, gemas) ---
const QUERY_MINERALES = `
SELECT ?mineral ?mineralLabel ?hardness ?crystalLabel ?formula ?density
       ?streakLabel ?spaceLabel ?pointLabel ?image ?sitelinks WHERE {
  VALUES ?tipo { wd:Q12089225 wd:Q429795 wd:Q83437 }
  ?mineral wdt:P31 ?tipo .
  ?mineral wdt:P18 ?image .
  ?mineral wikibase:sitelinks ?sitelinks .
  OPTIONAL { ?mineral wdt:P1088 ?hardness . }
  OPTIONAL { ?mineral wdt:P556 ?crystal . }
  OPTIONAL { ?mineral wdt:P274 ?formula . }
  OPTIONAL { ?mineral wdt:P2054 ?density . }
  OPTIONAL { ?mineral wdt:P534 ?streak . }   # color de la raya
  OPTIONAL { ?mineral wdt:P690 ?space . }    # grupo espacial
  OPTIONAL { ?mineral wdt:P589 ?point . }    # grupo puntual
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
}
ORDER BY DESC(?sitelinks)
LIMIT 365
`;

// --- Consulta de ROCAS (solo nombre + imagen) ---
const QUERY_ROCAS = `
SELECT ?rock ?rockLabel ?image ?sitelinks WHERE {
  ?rock wdt:P279* wd:Q8063 .
  ?rock wdt:P18 ?image .
  ?rock wikibase:sitelinks ?sitelinks .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
}
ORDER BY DESC(?sitelinks)
LIMIT 120
`;

// Pistas curadas para las rocas (Wikidata no las da)
const ROCAS_INFO = {
  granito: {
    rocaTipo: "Ígnea",
    textura: "Grano grueso",
    composicion: "Cuarzo, feldespato y mica",
    color: "Gris a rosado",
    dureza: "Duro",
  },
  basalto: {
    rocaTipo: "Ígnea",
    textura: "Grano fino",
    composicion: "Plagioclasa y piroxeno",
    color: "Negro a gris oscuro",
    dureza: "Duro",
  },
  obsidiana: {
    rocaTipo: "Ígnea",
    textura: "Vítrea",
    composicion: "Vidrio volcánico",
    color: "Negro brillante",
    dureza: "Duro",
  },
  pumita: {
    rocaTipo: "Ígnea",
    textura: "Vesicular y porosa",
    composicion: "Vidrio volcánico",
    color: "Gris claro a blanco",
    dureza: "Blando",
  },
  andesita: {
    rocaTipo: "Ígnea",
    textura: "Grano fino",
    composicion: "Plagioclasa y anfíbol",
    color: "Gris oscuro",
    dureza: "Duro",
  },
  gabro: {
    rocaTipo: "Ígnea",
    textura: "Grano grueso",
    composicion: "Plagioclasa y piroxeno",
    color: "Negro a verde oscuro",
    dureza: "Duro",
  },
  marmol: {
    rocaTipo: "Metamórfica",
    textura: "Cristalina",
    composicion: "Calcita recristalizada",
    color: "Blanco a variado",
    dureza: "Medio",
  },
  pizarra: {
    rocaTipo: "Metamórfica",
    textura: "Foliada fina",
    composicion: "Arcillas y mica",
    color: "Gris a negro",
    dureza: "Medio",
  },
  gneis: {
    rocaTipo: "Metamórfica",
    textura: "Bandeada",
    composicion: "Cuarzo, feldespato y mica",
    color: "Bandas claras y oscuras",
    dureza: "Duro",
  },
  cuarcita: {
    rocaTipo: "Metamórfica",
    textura: "Granular dura",
    composicion: "Cuarzo",
    color: "Blanco a gris",
    dureza: "Duro",
  },
  esquisto: {
    rocaTipo: "Metamórfica",
    textura: "Foliada",
    composicion: "Mica y cuarzo",
    color: "Gris plateado",
    dureza: "Medio",
  },
  caliza: {
    rocaTipo: "Sedimentaria",
    textura: "Grano fino",
    composicion: "Calcita (carbonato de calcio)",
    color: "Blanco a gris amarillento",
    dureza: "Medio",
  },
  arenisca: {
    rocaTipo: "Sedimentaria",
    textura: "Granos cementados",
    composicion: "Granos de cuarzo",
    color: "Amarillo a rojizo",
    dureza: "Medio",
  },
  conglomerado: {
    rocaTipo: "Sedimentaria",
    textura: "Cantos redondeados",
    composicion: "Fragmentos de roca",
    color: "Variado",
    dureza: "Medio",
  },
  lapislazuli: {
    rocaTipo: "Metamórfica",
    textura: "Compacta",
    composicion: "Lazurita, calcita y pirita",
    color: "Azul intenso",
    dureza: "Medio",
  },
  toba: {
    rocaTipo: "Ígnea (piroclástica)",
    textura: "Porosa compacta",
    composicion: "Ceniza volcánica",
    color: "Gris a beige",
    dureza: "Blando",
  },
};

// Color característico curado para minerales icónicos
const COLOR_INFO = {
  pirita: "Amarillo latón",
  oro: "Dorado",
  cobre: "Rojizo metálico",
  malaquita: "Verde",
  azurita: "Azul",
  turquesa: "Azul verdoso",
  hematites: "Gris a rojizo",
  magnetita: "Negro",
  galena: "Gris plomo",
  cinabrio: "Rojo",
  azufre: "Amarillo",
  rejalgar: "Rojo anaranjado",
  oropimente: "Amarillo",
  rodocrosita: "Rosa",
  rodonita: "Rosa",
  amatista: "Violeta",
  citrino: "Amarillo",
  esmeralda: "Verde",
  rubi: "Rojo",
  zafiro: "Azul",
  granate: "Rojo oscuro",
  almandino: "Rojo oscuro",
  cuarzo: "Incoloro",
  yeso: "Blanco",
  talco: "Blanco verdoso",
  grafito: "Gris oscuro",
  diamante: "Incoloro",
  fluorita: "Multicolor",
  calcita: "Blanco a incoloro",
  crisocola: "Azul verdoso",
  sodalita: "Azul",
  vanadinita: "Rojo anaranjado",
  wulfenita: "Naranja",
  epidota: "Verde",
  olivino: "Verde",
  peridoto: "Verde",
  amazonita: "Verde azulado",
  lazurita: "Azul",
  rutilo: "Rojizo",
  calcopirita: "Amarillo latón",
  opalo: "Multicolor iridiscente",
  aguamarina: "Azul verdoso claro",
  calcedonia: "Gris azulado translúcido",
  jaspe: "Rojo pardo",
  cornalina: "Naranja rojizo",
  blenda: "Marrón a negro",
  goethita: "Marrón amarillento a negro",

    // Top 40 populares sin color
  agata: "Bandas multicolor", topacio: "Amarillo miel a incoloro", berilo: "Verde a azul",
  halita: "Incoloro a blanco", corindon: "Rojo a azul", dolomita: "Blanco rosado",
  zircon: "Marrón rojizo", caolinita: "Blanco", aragonito: "Blanco a amarillento",
  onix: "Negro con bandas", espinela: "Rojo a azul", baritina: "Blanco a incoloro",
  andalucita: "Marrón rosado verdoso",

  // Resto de minerales
  wolframita: "Marrón negruzco", electro: "Amarillo pálido", "cuarzo-citrino": "Amarillo dorado",
  tanzanita: "Azul violáceo", argentita: "Gris plomo", vivianita: "Azul verdoso",
  autunita: "Amarillo verdoso", anatasa: "Marrón a negro azulado", atacamita: "Verde esmeralda",
  niquelina: "Rojo cobrizo", crocoita: "Rojo anaranjado", estaurolita: "Marrón rojizo",
  andesina: "Blanco grisáceo", brookita: "Marrón rojizo", torbernita: "Verde esmeralda",
  jarosita: "Amarillo ocre", hedenbergita: "Verde oscuro a negro", eritrina: "Rosa carmín",
  euxenita: "Negro pardusco", "espato-de-islandia": "Incoloro transparente", halloysita: "Blanco",
  charoite: "Violeta", abernathyita: "Amarillo", samarskita: "Negro pardusco",
  valentinita: "Blanco a incoloro", armalcolita: "Negro", laumontita: "Blanco a incoloro",
  annabergita: "Verde manzana", escorodita: "Verde a marrón", kernita: "Incoloro a blanco",
  ferberita: "Negro", melita: "Miel a marrón", beudantita: "Verde a marrón",
  polibasita: "Negro metálico", hessita: "Gris plomo", krennerita: "Amarillo latón",
};

// Deduce la familia (clase química) a partir de la fórmula
function familiaDeFormula(formula) {
  if (!formula) return "";
  const f = formula;
  const letras = f.replace(/[^A-Za-z]/g, "");
  const nativos = [
    "Au",
    "Ag",
    "Cu",
    "Fe",
    "Pt",
    "Pd",
    "Pb",
    "Bi",
    "As",
    "Sb",
    "Hg",
    "Sn",
    "Zn",
    "Ni",
    "S",
    "C",
  ];

  if (nativos.includes(letras)) return "Elemento nativo";
  if (f.includes("CO₃")) return "Carbonato";
  if (f.includes("SO₄")) return "Sulfato";
  if (f.includes("PO₄")) return "Fosfato";
  if (/Si/.test(f) && /O/.test(f)) return "Silicato";
  if (/O/.test(f)) return "Óxido / hidróxido";
  if (/S/.test(f)) return "Sulfuro";
  if (/[FI]|Cl|Br/.test(f)) return "Haluro";
  return "";
}

// Deriva el brillo a partir de la familia (solo casos claros)
function brilloDeFamilia(familia) {
  if (familia === "Sulfuro" || familia === "Elemento nativo") return "Metálico";
  if (
    ["Silicato", "Carbonato", "Sulfato", "Haluro", "Fosfato"].includes(familia)
  )
    return "No metálico (vítreo)";
  return ""; // óxidos y desconocidos: ambiguo, se deja vacío
}

// Categoría de dureza a partir del número de Mohs
function categoriaDureza(dureza) {
  const n = parseFloat(dureza);
  if (!Number.isFinite(n)) return "";
  if (n < 3) return "Blando";
  if (n <= 6) return "Medio";
  return "Duro";
}

const SISTEMAS = [
  "triclínico",
  "monoclínico",
  "ortorrómbico",
  "tetragonal",
  "trigonal",
  "hexagonal",
  "cúbico",
];
const limpiarSistema = (txt) => {
  const t = (txt || "").toLowerCase();
  const s = SISTEMAS.find((x) => t.includes(x));
  return s ? s[0].toUpperCase() + s.slice(1) : "";
};

// Limpia "space group P3₁21" → "P3₁21"
const limpiarGrupoEspacial = (txt) =>
  (txt || "").replace(/space group/i, "").trim();

const capitalizar = (s) =>
  s ? s.charAt(0).toLocaleUpperCase("es") + s.slice(1) : s;

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const miniatura = (url) => `${url.replace("http://", "https://")}?width=1200`;

const fmtDensidad = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? `${Math.round(n * 10) / 10} g/cm³` : "";
};

async function consultar(query) {
  const res = await fetch(
    `${ENDPOINT}?format=json&query=${encodeURIComponent(query)}`,
    {
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": "GuessTheRock/1.0 (proyecto educativo)",
      },
    },
  );
  if (!res.ok) throw new Error(`Wikidata respondió ${res.status}`);
  const json = await res.json();
  return json.results.bindings;
}

async function main() {
  const vistos = new Set();
  const lista = [];

  // ---------- MINERALES ----------
  const filasMin = await consultar(QUERY_MINERALES);
  for (const f of filasMin) {
    const nombre = capitalizar(f.mineralLabel?.value || "");
    const imagen = f.image?.value;
    if (!nombre || !imagen) continue;

    const id = slug(nombre);
    if (vistos.has(id)) continue;
    vistos.add(id);

    const sistema = limpiarSistema(f.crystalLabel?.value);
    const dureza = f.hardness?.value || "";
    const formula = f.formula?.value || "";
    const densidad = fmtDensidad(f.density?.value);
    const familia = familiaDeFormula(formula);
    const color = COLOR_INFO[id] || "";
    const raya = f.streakLabel?.value || "";
    const grupoEsp = limpiarGrupoEspacial(f.spaceLabel?.value);
    const grupoPto = f.pointLabel?.value || "";
    const brillo = brilloDeFamilia(familia);
    const durCat = categoriaDureza(dureza);

    // Pistas: de la MÁS OBTUSA (técnica) a la MÁS CLARA (reveladora)
    const pistas = [];
    if (grupoEsp) pistas.push(`Grupo espacial: ${grupoEsp}`);
    if (grupoPto) pistas.push(`Grupo puntual: ${grupoPto}`);
    if (familia) pistas.push(`Familia: ${familia}`);
    if (sistema) pistas.push(`Sistema: ${sistema}`);
    if (densidad) pistas.push(`Densidad: ${densidad}`);
    if (durCat) pistas.push(`Dureza: ${durCat}`);
    if (brillo) pistas.push(`Brillo: ${brillo}`);
    if (dureza) pistas.push(`Dureza (Mohs): ${dureza}`);
    if (raya) pistas.push(`Raya: ${raya}`);
    if (color) pistas.push(`Color: ${color}`);
    if (formula) pistas.push(`Fórmula: ${formula}`);

    if (pistas.length < 2) continue;

    lista.push({
      id,
      nombre,
      tipo: "mineral",
      imagen: miniatura(imagen),
      familia,
      color,
      sistema,
      densidad,
      brillo,
      raya,
      pistas,
    });
  }

  // ---------- ROCAS ----------
  const filasRoc = await consultar(QUERY_ROCAS);
  for (const f of filasRoc) {
    const nombre = capitalizar(f.rockLabel?.value || "");
    const imagen = f.image?.value;
    if (!nombre || !imagen) continue;

    const id = slug(nombre);
    if (vistos.has(id)) continue;

    const info = ROCAS_INFO[id];
    if (!info) continue;
    vistos.add(id);

    const pistas = [];
    if (info.dureza) pistas.push(`Dureza: ${info.dureza}`);
    if (info.rocaTipo) pistas.push(`Tipo de roca: ${info.rocaTipo}`);
    if (info.textura) pistas.push(`Textura: ${info.textura}`);
    if (info.composicion) pistas.push(`Composición: ${info.composicion}`);
    if (info.color) pistas.push(`Color: ${info.color}`);

    lista.push({
      id,
      nombre,
      tipo: "roca",
      imagen: miniatura(imagen),
      rocaTipo: info.rocaTipo,
      textura: info.textura,
      composicion: info.composicion,
      color: info.color,
      pistas,
    });
  }

  // id numérico secuencial
  const ordenados = lista.map((m, i) => ({ idNum: i + 1, ...m }));

  const contenido = `// Generado por scripts/generar-minerales.mjs — no editar a mano
export const MINERALS = ${JSON.stringify(ordenados, null, 2)}

export const NOMBRES = [...MINERALS.map((m) => m.nombre)].sort()
`;

  writeFileSync("src/data/minerals.js", contenido);
  const nRocas = ordenados.filter((m) => m.tipo === "roca").length;
  const conRaya = ordenados.filter((m) => m.raya).length;
  console.log(
    `✔ ${ordenados.length} elementos (${nRocas} rocas, ${conRaya} con raya) en src/data/minerals.js`,
  );
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
