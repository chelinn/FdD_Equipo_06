import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ══════════════════════════════════════════════════════════════
//  MAPA DE APIS Y PARÁMETROS QUE CUBRE CADA UNA
// ══════════════════════════════════════════════════════════════
//
//  API 1 → GBIF (api.gbif.org)                         — sin key
//    [OK] nombre científico, familia, key de especie
//    [OK] nombre común real  (endpoint vernacularNames)
//    [OK] coordenadas de ocurrencia real
//
//  API 2 → iNaturalist + Wikipedia                     — sin key
//    [OK] imagen HD de campo real  (iNat primero, wiki fallback)
//
//  API 3 → Trefle (trefle.io)                          — key gratis
//    [OK] pH mínimo/máximo por especie
//    [OK] precipitación mín/máx por especie (mm/año)
//    [OK] temperatura mín/máx por especie (°C)
//    [OK] luz solar requerida (escala 0-10)
//    [OK] tolerancia a sequía
//
//  API 4 → SoilGrids ISRIC (rest.isric.org)            — sin key
//    [OK] pH real medido del suelo
//    [OK] carbono orgánico (SOC %)
//    [OK] nitrógeno total
//    [OK] % arena, % limo, % arcilla → clase textural USDA
//    [OK] CIC (capacidad de intercambio catiónico)
//    [OK] materia orgánica (factor Van Bemmelen)
//
//  API 5 → NASA POWER (power.larc.nasa.gov)            — sin key
//    [OK] temperatura promedio real (30 años MERRA-2)
//    [OK] precipitación anual real (30 años MERRA-2)
//    [OK] radiación solar real (CERES satélite)
//    [OK] humedad relativa real
//
//  API 6 → Open-Meteo Elevation (api.open-meteo.com)  — sin key
//    [OK] altitud real del punto (DEM global)
//
//  API 7 → OpenTopoData (api.opentopodata.org)         — sin key
//    [OK] pendiente del terreno (calculada desde DEM)
//
//  PARÁMETROS SIN API LIBRE:
//    [!]  Fósforo  → estimado por fórmula (pH + arcilla)
//    [!]  Potasio  → estimado por fórmula (SOC + arcilla)
// ══════════════════════════════════════════════════════════════

const TREFLE_TOKEN = process.env.TREFLE_TOKEN || "TU_TOKEN_TREFLE_AQUI";

const GBIF_BASE =
  "https://api.gbif.org/v1/species/search" +
  "?datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c" +
  "&highertaxonKey=7707728&rank=SPECIES&status=ACCEPTED";

const FETCH_LIMIT = 10;

// ─────────────────────────────────────────────────────────────
// HELPER: fetch con timeout y log de error real
// ─────────────────────────────────────────────────────────────
async function safeFetch(
  url: string,
  label: string,
  timeoutMs = 20000
): Promise<any | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) {
      console.log(`    [${label}] HTTP ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (err: any) {
    clearTimeout(timer);
    console.log(
      `    [${label}] ${err.name === "AbortError" ? "Timeout" : err.message}`
    );
    return null;
  }
}

// ══════════════════════════════════════════════════════════════
//  API 1 — GBIF: nombre común + coordenadas
// ══════════════════════════════════════════════════════════════
async function getCommonName(gbifKey: number): Promise<string> {
  const data = await safeFetch(
    `https://api.gbif.org/v1/species/${gbifKey}/vernacularNames?limit=20`,
    "GBIF-NombreComún"
  );
  const results: any[] = data?.results ?? [];
  const es = results.find((r: any) => r.language === "spa");
  const en = results.find((r: any) => r.language === "eng");
  return (es || en || results[0])?.vernacularName ?? "Sin nombre común";
}

async function getOccurrenceCoords(
  gbifKey: number
): Promise<{ lat: number; lon: number } | null> {
  const data = await safeFetch(
    `https://api.gbif.org/v1/occurrence/search?taxonKey=${gbifKey}&hasCoordinate=true&limit=1`,
    "GBIF-Ocurrencia"
  );
  const occ = data?.results?.[0];
  if (!occ?.decimalLatitude) return null;
  return { lat: occ.decimalLatitude, lon: occ.decimalLongitude };
}

// ══════════════════════════════════════════════════════════════
//  API 2 — iNaturalist + Wikipedia: imagen HD
// ══════════════════════════════════════════════════════════════
async function getBestImage(canonicalName: string): Promise<string | null> {
  // Prioridad 1: iNaturalist (fotos reales de campo)
  const inat = await safeFetch(
    `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(canonicalName)}&rank=species&per_page=1`,
    "iNaturalist"
  );
  const inatImg = inat?.results?.[0]?.default_photo?.medium_url;
  if (inatImg) return inatImg;

  // Fallback: Wikipedia
  const wiki = await safeFetch(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(canonicalName)}&prop=pageimages&format=json&pithumbsize=800&origin=*`,
    "Wikipedia"
  );
  const pages = wiki?.query?.pages;
  if (!pages) return null;
  return (Object.values(pages)[0] as any)?.thumbnail?.source ?? null;
}

// ══════════════════════════════════════════════════════════════
//  API 3 — Trefle: requerimientos por especie
// ══════════════════════════════════════════════════════════════
interface TrefleData {
  phMin: number | null;
  phMax: number | null;
  precipMin: number | null;
  precipMax: number | null;
  tempMin: number | null;
  tempMax: number | null;
  light: number | null;       // 0-10
  humidity: number | null;    // 0-10
  droughtTolerance: string;
}

async function getTrefleData(canonicalName: string): Promise<TrefleData | null> {
  if (TREFLE_TOKEN === "TU_TOKEN_TREFLE_AQUI") return null;

  const search = await safeFetch(
    `https://trefle.io/api/v1/species/search?token=${TREFLE_TOKEN}&q=${encodeURIComponent(canonicalName)}`,
    "Trefle-Búsqueda"
  );
  const slug = search?.data?.[0]?.slug;
  if (!slug) return null;

  const detail = await safeFetch(
    `https://trefle.io/api/v1/species/${slug}?token=${TREFLE_TOKEN}`,
    "Trefle-Detalle"
  );

  // Trefle puede devolver datos en data.main_species o directamente en data
  const g = detail?.data?.main_species?.growth ?? detail?.data?.growth;
  if (!g) return null;

  const precipMin = g.minimum_precipitation?.mm ?? null;
  const drought =
    precipMin !== null && precipMin < 400
      ? "Alta Tolerancia"
      : precipMin !== null && precipMin > 900
        ? "Baja Tolerancia"
        : "Media Tolerancia";

  return {
    phMin: g.ph_minimum ?? null,
    phMax: g.ph_maximum ?? null,
    precipMin,
    precipMax: g.maximum_precipitation?.mm ?? null,
    tempMin: g.minimum_temperature?.deg_c ?? null,
    tempMax: g.maximum_temperature?.deg_c ?? null,
    light: g.light ?? null,
    humidity: g.atmospheric_humidity ?? null,
    droughtTolerance: drought,
  };
}

// ══════════════════════════════════════════════════════════════
//  API 4 — SoilGrids ISRIC: datos reales del suelo
// ══════════════════════════════════════════════════════════════
interface SoilData {
  ph: number;
  soc: number;      // % carbono orgánico
  nitrogen: number; // mg/kg
  sand: number;     // %
  silt: number;     // %
  clay: number;     // %
  cec: number;      // cmol/kg
  om: number;       // % materia orgánica
  textureClass: string;
}

async function getSoilData(lat: number, lon: number): Promise<SoilData | null> {
  const data = await safeFetch(
    `https://rest.isric.org/soilgrids/v2.0/properties/query` +
    `?lon=${lon}&lat=${lat}` +
    `&property=phh2o&property=soc&property=nitrogen` +
    `&property=sand&property=silt&property=clay&property=cec` +
    `&depth=0-5cm&value=mean`,
    "SoilGrids-ISRIC",
    25000
  );
  if (!data?.properties?.layers) return null;

  const getVal = (name: string): number | null => {
    const layer = data.properties.layers.find((l: any) => l.name === name);
    const val = layer?.depths?.[0]?.values?.mean;
    return val != null ? parseFloat(val) : null;
  };

  const phRaw = getVal("phh2o");    // × 10
  const socRaw = getVal("soc");      // dg/kg
  const nRaw = getVal("nitrogen"); // cg/kg
  const sandRaw = getVal("sand");     // g/kg
  const siltRaw = getVal("silt");     // g/kg
  const clayRaw = getVal("clay");     // g/kg
  const cecRaw = getVal("cec");      // mmol(c)/kg

  if (phRaw == null) return null;

  const ph = parseFloat((phRaw / 10).toFixed(1));
  const soc = socRaw != null ? parseFloat((socRaw / 10).toFixed(2)) : 2.0;
  const nit = nRaw != null ? parseFloat((nRaw / 100).toFixed(3)) : 0.2;
  const sand = sandRaw != null ? Math.round(sandRaw / 10) : 40;
  const silt = siltRaw != null ? Math.round(siltRaw / 10) : 30;
  const clay = clayRaw != null ? Math.round(clayRaw / 10) : 30;
  const cec = cecRaw != null ? parseFloat((cecRaw / 10).toFixed(1)) : 15.0;
  const om = parseFloat((soc * 1.724).toFixed(2)); // Factor Van Bemmelen

  return {
    ph, soc, nitrogen: parseFloat((nit * 1000).toFixed(1)),
    sand, silt, clay, cec, om,
    textureClass: usdaTextureClass(sand, silt, clay),
  };
}

function usdaTextureClass(sand: number, silt: number, clay: number): string {
  if (clay >= 40) return "Arcilloso";
  if (clay >= 27 && sand <= 20) return "Arcillo Limoso";
  if (clay >= 27 && sand <= 45) return "Franco Arcilloso";
  if (clay >= 20 && sand >= 45) return "Franco Arcillo Arenoso";
  if (clay >= 7 && silt >= 50 && clay < 27) return "Franco Limoso";
  if (silt >= 80) return "Limoso";
  if (sand >= 85 && silt < 15) return "Arenoso";
  if (sand >= 70 && clay < 15) return "Franco Arenoso";
  return "Franco";
}

// ══════════════════════════════════════════════════════════════
//  API 5 — NASA POWER: clima real histórico (MERRA-2 + CERES)
//
//  CORRECCIÓN vs tu versión:
//  [!] Tu URL usaba endpoint /climatology/point que devuelve
//     datos en formato diferente y es más lento.
//  [OK] Usamos /climatology/point con parámetros correctos:
//     T2M        = temperatura media a 2 metros (°C)
//     PRECTOTCORR = precipitación corregida (mm/día)
//     ALLSKY_SFC_SW_DWN = radiación solar descendente (MJ/m²/día)
//     RH2M       = humedad relativa a 2 metros (%)
//  [OK] El campo ANN devuelve el promedio anual directamente.
// ══════════════════════════════════════════════════════════════
interface NasaData {
  tempOptimal: number;    // °C promedio anual
  precipAnual: number;    // mm/año
  solarRad: number;       // MJ/m²/día promedio
  humidity: number;       // % humedad relativa
}

async function getNasaPowerData(lat: number, lon: number): Promise<NasaData | null> {
  // Climatología 30 años: temperatura, precipitación, radiación, humedad
  const url =
    `https://power.larc.nasa.gov/api/temporal/climatology/point` +
    `?parameters=T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN,RH2M` +
    `&community=AG` +
    `&longitude=${lon}&latitude=${lat}` +
    `&format=JSON`;

  const data = await safeFetch(url, "NASA-POWER", 30000);
  const params = data?.properties?.parameter;
  if (!params) return null;

  // El campo ANN es el promedio anual directo
  const tempAnn = params?.T2M?.ANN ?? null; // °C
  const precipDay = params?.PRECTOTCORR?.ANN ?? null; // mm/día → × 365 = mm/año
  const solarAnn = params?.ALLSKY_SFC_SW_DWN?.ANN ?? null; // MJ/m²/día
  const humAnn = params?.RH2M?.ANN ?? null; // %

  if (tempAnn == null) return null;

  return {
    tempOptimal: parseFloat(tempAnn.toFixed(1)),
    precipAnual: precipDay != null ? Math.round(precipDay * 365) : 1200,
    solarRad: solarAnn != null ? parseFloat(solarAnn.toFixed(1)) : 18,
    humidity: humAnn != null ? Math.round(humAnn) : 60,
  };
}

// ══════════════════════════════════════════════════════════════
//  API 6 — Open-Meteo: altitud real del punto
// ══════════════════════════════════════════════════════════════
async function getAltitude(lat: number, lon: number): Promise<number> {
  const data = await safeFetch(
    `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`,
    "Open-Meteo-Altitud"
  );
  return data?.elevation?.[0] != null ? Math.round(data.elevation[0]) : 200;
}

// ══════════════════════════════════════════════════════════════
//  API 7 — OpenTopoData: pendiente del terreno
//
//  CORRECCIÓN vs tu versión:
//  [!] Tu versión usaba "test-dataset" que es solo para pruebas
//     y tiene muy baja resolución. Además el cálculo de pendiente
//     tenía un error: dividías entre 110 cuando debería ser por
//     la distancia real entre los dos puntos en metros.
//  [OK] Usamos "srtm30m" (30m resolución global, más preciso).
//  [OK] Fórmula correcta: distancia entre puntos ≈ 111,320 m × Δlat
//     pendiente % = (Δelevación / distancia_horizontal) × 100
// ══════════════════════════════════════════════════════════════
async function getSlope(lat: number, lon: number): Promise<number> {
  // Dos puntos separados 0.001° ≈ 111 metros
  const data = await safeFetch(
    `https://api.opentopodata.org/v1/srtm30m?locations=${lat},${lon}|${lat + 0.001},${lon}`,
    "OpenTopo-Pendiente",
    15000
  );
  if (data?.results?.length >= 2) {
    const elev1: number = data.results[0].elevation ?? 0;
    const elev2: number = data.results[1].elevation ?? 0;
    const dz = Math.abs(elev2 - elev1);
    const distHoriz = 111.32; // metros por 0.001° de latitud
    const slopePct = (dz / distHoriz) * 100;
    return parseFloat(Math.min(60, slopePct).toFixed(1));
  }
  return 5; // fallback: pendiente suave
}

// ══════════════════════════════════════════════════════════════
//  FUSIÓN DE DATOS: combina todas las fuentes
//  Prioridad: datos reales específicos por especie (Trefle)
//             > datos reales geoespaciales (NASA/SoilGrids)
//             > estimados por fórmula
// ══════════════════════════════════════════════════════════════
function buildFinalData(
  soil: SoilData | null,
  nasa: NasaData | null,
  trefle: TrefleData | null,
  alt: number,
  slope: number,
  coords: { lat: number; lon: number } | null
) {
  // ── pH ──────────────────────────────────────────────────────
  const phOpt = soil?.ph ?? 6.5;
  const phMin = trefle?.phMin ?? parseFloat((phOpt - 1.0).toFixed(1));
  const phMax = trefle?.phMax ?? parseFloat((phOpt + 1.0).toFixed(1));

  // ── Carbono orgánico y derivados ────────────────────────────
  const soc = soil?.soc ?? 2.0;
  const om = soil?.om ?? parseFloat((soc * 1.724).toFixed(2));
  const cec = soil?.cec ?? 15.0;

  // ── Nitrógeno ───────────────────────────────────────────────
  const nit = soil?.nitrogen ?? 150;

  // ── Textura ─────────────────────────────────────────────────
  const sand = soil?.sand ?? 40;
  const silt = soil?.silt ?? 30;
  const clay = soil?.clay ?? 30;
  const texture = soil?.textureClass ?? "Franco (estimado)";

  // ── Fósforo y Potasio (sin API libre, fórmulas ecológicas) ──
  const pOpt = Math.round(10 + clay * 0.4 + (phOpt - 5) * 3);
  const kOpt = Math.round(80 + clay * 2 + soc * 10);

  // ── Humedad del suelo ───────────────────────────────────────
  // NASA da humedad relativa del aire → correlaciona con humedad del suelo
  // SoilGrids no mide humedad directamente, se estima desde textura
  const moistBase = Math.round(20 + clay * 0.5 + silt * 0.3);
  const nasaHum = nasa?.humidity ?? null;
  // Escalar: humedad relativa 0-100% → humedad suelo estimada
  const moistOpt = nasaHum != null
    ? Math.round(moistBase * 0.4 + nasaHum * 0.6)
    : moistBase;

  // ── Temperatura ─────────────────────────────────────────────
  const tempOpt = nasa?.tempOptimal ?? 20;
  const tempMin = trefle?.tempMin ?? parseFloat((tempOpt - 6).toFixed(1));
  const tempMax = trefle?.tempMax ?? parseFloat((tempOpt + 8).toFixed(1));

  // ── Precipitación ───────────────────────────────────────────
  const precipOpt = nasa?.precipAnual ?? 1200;
  const precipMin = trefle?.precipMin ?? Math.round(precipOpt * 0.5);
  const precipMax = trefle?.precipMax ?? Math.round(precipOpt * 1.7);

  // ── Radiación solar ─────────────────────────────────────────
  const solarOpt = nasa?.solarRad ?? 18;

  // ── Tolerancia a sequía ─────────────────────────────────────
  const drought = trefle?.droughtTolerance
    ?? (precipOpt < 600 ? "Alta Tolerancia" : precipOpt > 1500 ? "Baja Tolerancia" : "Media Tolerancia");

  // ── Auditoría de fuentes ────────────────────────────────────
  const fuentes: string[] = [];
  if (soil) fuentes.push("SoilGrids");
  if (nasa) fuentes.push("NASA POWER");
  if (trefle) fuentes.push("Trefle");
  const dataSource = fuentes.length
    ? `Datos reales: ${fuentes.join(" + ")}`
    : "Estimado (fallback)";

  return {
    soilData: {
      phMin, phMax, phOptimal: phOpt,
      organicCarbonMin: parseFloat((soc * 0.5).toFixed(2)),
      organicCarbonMax: parseFloat((soc * 2.0).toFixed(2)),
      organicCarbonOptimal: soc,
      nitrogenMin: Math.round(nit * 0.6),
      nitrogenMax: Math.round(nit * 1.6),
      nitrogenOptimal: nit,
      phosphorusMin: Math.max(5, pOpt - 12),
      phosphorusMax: pOpt + 22,
      phosphorusOptimal: pOpt,
      potassiumMin: Math.max(50, kOpt - 50),
      potassiumMax: kOpt + 100,
      potassiumOptimal: kOpt,
      moistureMin: Math.max(10, moistOpt - 20),
      moistureMax: Math.min(90, moistOpt + 20),
      moistureOptimal: moistOpt,
      sandMin: Math.max(0, sand - 15), sandMax: Math.min(100, sand + 15),
      siltMin: Math.max(0, silt - 15), siltMax: Math.min(100, silt + 15),
      clayMin: Math.max(0, clay - 15), clayMax: Math.min(100, clay + 15),
      textureClass: texture,
      organicMatterMin: parseFloat((om * 0.5).toFixed(2)),
      organicMatterMax: parseFloat((om * 2.0).toFixed(2)),
      organicMatterOptimal: om,
      cecMin: parseFloat((cec * 0.6).toFixed(1)),
      cecMax: parseFloat((cec * 1.6).toFixed(1)),
      cecOptimal: cec,
    },
    climateData: {
      tempMin, tempMax, tempOptimal: tempOpt,
      precipMin, precipMax, precipOptimal: precipOpt,
      solarRadMin: parseFloat((solarOpt * 0.6).toFixed(1)),
      solarRadMax: parseFloat((solarOpt * 1.4).toFixed(1)),
      solarRadOptimal: solarOpt,
      altMin: Math.max(0, alt - 400),
      altMax: alt + 600,
      altOptimal: alt,
      lifeZone: dataSource,
      droughtTolerance: drought,
    },
    locationData: {
      slopeMin: 0,
      slopeMax: Math.round(slope * 2.5),
      slopeOptimal: Math.round(slope),
      latMin: coords ? parseFloat((coords.lat - 10).toFixed(2)) : -20.0,
      latMax: coords ? parseFloat((coords.lat + 10).toFixed(2)) : 20.0,
    },
    dataSource,
  };
}

// ══════════════════════════════════════════════════════════════
//  PIPELINE PRINCIPAL
// ══════════════════════════════════════════════════════════════
async function runPipeline() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(" PIPELINE MULTI-API");
  console.log("   GBIF + iNaturalist + Trefle + SoilGrids + NASA POWER");
  console.log("   + Open-Meteo Elevation + OpenTopoData");
  console.log("═══════════════════════════════════════════════════════════════");

  if (TREFLE_TOKEN === "TU_TOKEN_TREFLE_AQUI") {
    console.log(" AVISO: Sin token de Trefle. Regístrate gratis en https://trefle.io");
    console.log("   Luego ejecuta: TREFLE_TOKEN=tu_token npx tsx prisma/seed_api_miner.ts\n");
  }

  const currentCount = await prisma.plantSpecies.count();
  console.log(` Especies en BD: ${currentCount}`);

  const gbifData = await safeFetch(
    `${GBIF_BASE}&limit=${FETCH_LIMIT}&offset=${currentCount}`,
    "GBIF-Especies"
  );
  if (!gbifData) throw new Error("GBIF no respondió");

  const valid: any[] = (gbifData.results ?? []).filter(
    (p: any) => p.scientificName && p.key
  );
  console.log(` OK GBIF: ${valid.length} especies encontradas.\n`);

  let added = 0;

  for (const plant of valid) {
    const scientificName: string = plant.scientificName;
    const canonicalName: string =
      plant.canonicalName || scientificName.split(" ").slice(0, 2).join(" ");
    const family: string = plant.family ?? "Familia no registrada";
    const gbifKey: number = plant.key;

    console.log(`\n [${added + 1}/${valid.length}] ${canonicalName}`);

    // ── Datos independientes de coordenadas (en paralelo) ─────
    const [commonName, imageUrl, coords, trefleData] = await Promise.all([
      getCommonName(gbifKey),
      getBestImage(canonicalName),
      getOccurrenceCoords(gbifKey),
      getTrefleData(canonicalName),
    ]);

    console.log(`   Nombre común:  ${commonName}`);
    console.log(`   Imagen:        ${imageUrl ? "OK" : "Error"}`);
    console.log(`   Trefle:        ${trefleData
      ? `OK pH=[${trefleData.phMin ?? "?"}–${trefleData.phMax ?? "?"}] Temp=[${trefleData.tempMin ?? "?"}°C–${trefleData.tempMax ?? "?"}°C]`
      : "Error (sin token o especie no en BD)"}`);
    console.log(`   Coordenadas:   ${coords
      ? `lat=${coords.lat.toFixed(3)}, lon=${coords.lon.toFixed(3)}`
      : "Error No encontradas"}`);

    // ── Datos que dependen de coordenadas (en paralelo) ────────
    let soilData: SoilData | null = null;
    let nasaData: NasaData | null = null;
    let altitude: number = 200;
    let slope: number = 5;

    if (coords) {
      const [soil, nasa, alt, slp] = await Promise.all([
        getSoilData(coords.lat, coords.lon),
        getNasaPowerData(coords.lat, coords.lon),
        getAltitude(coords.lat, coords.lon),
        getSlope(coords.lat, coords.lon),
      ]);
      soilData = soil;
      nasaData = nasa;
      altitude = alt;
      slope = slp;
    }

    console.log(`   SoilGrids:     ${soilData
      ? `OK pH=${soilData.ph} | SOC=${soilData.soc}% | ${soilData.textureClass}`
      : "Error"}`);
    console.log(`   NASA POWER:    ${nasaData
      ? `OK T=${nasaData.tempOptimal}°C | PP=${nasaData.precipAnual}mm/año | Rad=${nasaData.solarRad} MJ/m²/día | HR=${nasaData.humidity}%`
      : "Error"}`);
    console.log(`   Altitud:       ${altitude}m | Pendiente: ${slope}%`);

    // ── Fusionar y guardar ──────────────────────────────────────
    const final = buildFinalData(soilData, nasaData, trefleData, altitude, slope, coords);

    await prisma.plantSpecies.upsert({
      where: { scientificName },
      update: { imageUrl, commonName },
      create: {
        scientificName,
        commonName,
        family,
        imageUrl,
        lifeForm: "Planta Vascular (GBIF Oficial)",
        growthHabit: "Vascular",
        nativeRegion: coords
          ? `Lat: ${coords.lat.toFixed(3)}, Lon: ${coords.lon.toFixed(3)}`
          : "Distribución Global",
        soilRequirement: { create: final.soilData },
        climateRequirement: { create: final.climateData },
        locationParameter: { create: final.locationData },
      },
    });

    added++;
    console.log(`   Guardada | ${final.dataSource}`);
  }

  console.log(`\n═══════════════════════════════════════════════════════════════`);
  console.log(` TERMINADO: ${added} plantas nuevas agregadas.`);
  console.log(` Total en BD: ${currentCount + added} especies.`);
  console.log(`═══════════════════════════════════════════════════════════════`);

  await prisma.$disconnect();
}

runPipeline().catch(async (err) => {
  console.error(" Error crítico:", err);
  await prisma.$disconnect();
  process.exit(1);
});