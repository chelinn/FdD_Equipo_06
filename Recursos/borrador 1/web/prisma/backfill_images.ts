import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Robot extractor de fondos HD desde Wikipedia
async function getWikipediaImageUrl(canonicalName: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(canonicalName);
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${query}&prop=pageimages&format=json&pithumbsize=800`;
    
    const res = await fetch(wikiUrl);
    if (!res.ok) return null;
    
    const data = await res.json();
    const pages = data.query?.pages;
    
    if (pages) {
      const firstPageId = Object.keys(pages)[0];
      if (firstPageId !== "-1" && pages[firstPageId].thumbnail) {
        return pages[firstPageId].thumbnail.source;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function runBackfill() {
  console.log("==========================================================");
  console.log("📸 MINERO DE RECUPERACIÓN: Reparando fondos faltantes...");
  console.log("==========================================================");
  
  // Paso 1: Pedirle a Prisma todos los registros que carecen de Imagen.
  const plantsWithoutImages = await prisma.plantSpecies.findMany({
    where: {
      OR: [
        { imageUrl: null },
        { imageUrl: "" }
      ]
    }
  });

  console.log(`📊 Detectadas ${plantsWithoutImages.length} especies sin foto (Modo Fantasma) en tu base de datos.`);
  
  if (plantsWithoutImages.length === 0) {
    console.log("✅ ¡Todo está perfecto! Todas tus plantas actuales ya lucen maravillosas con fotos de fondo.");
    return;
  }

  let repairedCount = 0;

  // Paso 2: Ejecutar el algoritmo "Tijera" retroactivamente en cada una.
  for (const plant of plantsWithoutImages) {
    // Al no tener el flag exacto de GBIF a la mano, seccionamos manualmente las dos primeras palabras biológicas
    const canonicalName = plant.scientificName.split(" ").slice(0, 2).join(" ");
    
    console.log(`🔍 [Reparando] Buscando en Wikipedia: ${canonicalName}...`);
    const imageUrl = await getWikipediaImageUrl(canonicalName);
    
    if (imageUrl) {
      console.log(` ---> 🎇 ¡Fotografía Original Recuperada y Ensamblada!`);
      // Paso 3: Pegamos el link con un UPDATE solo a esa fila de la base de datos
      await prisma.plantSpecies.update({
        where: { id: plant.id },
        data: { imageUrl: imageUrl } // Guardamos permanentemente la URL
      });
      repairedCount++;
    } else {
      console.log(` ---> ❌ Vacío en Wikimedia. Esta especie biológica definitivamente no tiene avatar registrado.`);
    }
  }

  console.log(`\n🚀 ¡RESTAURACIÓN DE CÓDIGO FINALIZADA!`);
  console.log(`📈 Logramos salvar el catálogo y asignarle fotos HD a ${repairedCount} plantas huérfanas de las ${plantsWithoutImages.length} detectadas.`);
}

runBackfill()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
