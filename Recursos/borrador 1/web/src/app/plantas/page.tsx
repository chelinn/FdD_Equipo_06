// ============================================================
// MOTOR PRINCIPAL DEL SISTEMA WEB (Next.js + Prisma ORM)
// ============================================================

// 1. PrismaClient: Nos permite conectarnos a tu base de datos SQLite con código Javascript
// sin tener que escribir las confusas sentencias "SELECT * FROM" (SQL nativo).
import { PrismaClient } from '@prisma/client';

// 2. Importamos todos los iconos visuales desde la librería "lucide-react".
// Estos iconos pesan cero, son vectoriales matemáticos (SVG) y se escalan en alta definición.
import { 
  LeafyGreen, Sprout, CloudRain, ThermometerSun, 
  Droplets, FlaskConical, Mountain, MapPin, 
  Sun, Beaker, TreeDeciduous, Activity, Globe, Compass, TestTube
} from 'lucide-react';

// 3. 'force-dynamic': Esta es una instrucción CRÍTICA de Next.js 14+. 
// Obliga a que la página NO guarde memorias falsas (caché durmiente).
// Garantiza que cada vez que recargas tu web (F5), recupere los datos vivos actuales de la base de datos.
export const dynamic = 'force-dynamic';

// 4. Se "instancia" o "enciende" la conexión estable contra el puente del ORM de Prisma.
const prisma = new PrismaClient();

// 5. Función principal (Componente). La palabra "async" convierte este segmento en un 
// "React Server Component". Significa que TODA esta lectura de la base ocurre ocultamente en 
// el servidor/computadora para ser híper rápida y no expone passwords de BD hacia internet.
export default async function CatalogoPlantasPage() {
  
  // 6. AQUÍ ESTÁ LA MAGIA DE CONEXIÓN. Guardamos en la constante 'plants' una búsqueda a la BD.
  // Le pedimos a prisma que vaya a la tabla "plantSpecies" y extraiga TODO ("findMany").
  const plants = await prisma.plantSpecies.findMany({
    // La opción "include" funciona como un join en base de datos; ordena a la base que nos pase 
    // no solo el árbol, sino que de paso agarre todas sus tablas químicas, climáticas y geográficas conectadas.
    include: {
      climateRequirement: true,   // Extrae datos de la tabla de clima
      soilRequirement: true,      // Extrae perfiles de textura y pH de suelo
      locationParameter: true     // Extrae ubicación y latitud
    }
  });

  // 7. BLOQUE VISUAL (HTML/Tailwind):
  // El return entrega lo que el usuario observará gráficamente en su monitor.
  return (
    // CONTENEDOR MAESTRO:
    // 'min-h-screen' hace que coloree la página desde arriba hasta el tope de la barra del explorador inferior.
    // 'bg-[conic-gradient...]' traza un degradado que da el efecto de iluminación "Glass" suave por detrás.
    <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-gray-100 to-slate-200 p-6 md:p-12 font-sans selection:bg-emerald-200">
      
      {/* max-w-7xl limita que el diseño no se ensanche infinitamente en pantallas ultrawide grandes */}
      <div className="max-w-7xl mx-auto">
        
        {/* ============================================================
            CABEZA DE PÁGINA (Header)
            ============================================================ */}
        <div className="mb-14 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <TreeDeciduous className="w-12 h-12 text-emerald-600 drop-shadow-sm" />
            Catálogo de Especies
          </h1>
        </div>
        
        {/* ============================================================
            GRILLA PRINCIPAL (Grid)
            Aquí ordenamos las columnas: 'xl:grid-cols-2' significa que si es pantalla gigante, pondrá 2 tarjetas lado a lado.
            Si es móvil, se pondrá automáticamente a 1 por la adaptabilidad web (responsivo).
            ============================================================ */}
        <div className="grid grid-cols-1 xl:grid-cols-2 lg:gap-10 gap-10">
          
          {/* 
            EL RECOLECTOR/ITERADOR DE JAVA SCRIPT(.map): 
            Esta es la línea que construye cientos de tarjetas automáticas. 
            Toma todo el arreglo de plantas traído de la Base de Datos Arriba, e imprime cada tarjeta por cada uno ('p').
          */}
          {plants.map((p) => (
            <div 
              key={p.id} // 'key' es obligatorio en React para que no se confundan las plantas en memoria.
              // Todas las palabras "hover:algo" hacen que cuando el usuario pase el mouse, la tarjeta
              // flote suavemente en el eje Y ('hover:-translate-y-1') y se ilumine o sombree automáticamente.
              className="group bg-white/95 backdrop-blur-3xl rounded-[2rem] overflow-hidden border-2 border-white/80 shadow-2xl shadow-slate-200/50 hover:shadow-emerald-900/10 hover:-translate-y-1 hover:bg-white transition-all duration-500 flex flex-col"
            >
              
              {/* === ENCABEZADO FOTOGRÁFICO DE LA TARJETA === */}
              {/* Ampliamos la altura a h-80 (320px) para que la foto tenga grandísimo protagonismo */}
              <div className="relative overflow-hidden flex flex-col justify-end h-80">
                {/* FONDO DE IMAGEN DINÁMICA: Si la base de datos tiene foto, la muestra a color completo */}
                {p.imageUrl ? (
                  <>
                    {/* Object cover asegura que no se deforme. group-hover da el efecto zoom */}
                    <img src={p.imageUrl} alt={p.scientificName} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    
                    {/* Capa oscura de cristal ÚNICAMENTE en la mitad inferior para dejar brillar la planta arriba */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-teal-800">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">
                      <LeafyGreen className="w-40 h-40" />
                    </div>
                  </div>
                )}
                
                {/* Títulos y Etiquetas sobre la Fotografía */}
                <div className="relative z-10 p-8 w-full">
                  <h2 className="text-4xl text-white font-extrabold italic tracking-wide drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)] leading-tight">
                    {p.scientificName}
                  </h2>
                  <div className="flex flex-wrap gap-3 items-center mt-4">
                    <span className="font-bold text-emerald-50 uppercase tracking-widest text-sm bg-black/70 px-4 py-2 rounded-lg backdrop-blur-md shadow-lg border border-white/10">
                      {p.commonName}
                    </span>
                    <span className="bg-emerald-600/90 border border-emerald-400 px-4 py-2 rounded-full text-xs font-black text-white tracking-widest shadow-lg uppercase">
                      {p.family}
                    </span>
                  </div>
                </div>
              </div>


              {/* === CUERPO DE LA TARJETA === */}
              <div className="p-8 space-y-10 flex-grow">
                
                {/* 1. SECCIÓN SUELO (Edáficos) */}
                <div className="space-y-5">
                  <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-xl border-b-2 border-slate-200 pb-3 uppercase tracking-wider">
                    <Sprout className="w-6 h-6 text-amber-600" /> 
                    Parámetros del Suelo
                  </h3>
                  
                  {/* El grid subdivide hasta 4 columnas ('grid-cols-4') porque los números de los parámetros encajan perfectamente sin ocupar filas gigantes. */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-7 gap-x-4">
                    
                    {/* Parámetro 1: pH --- Interpola del ORM la palabra 'p.soilRequirement?.phOptimal' */}
                    {/* El Signo '?' en variables (ej: soilRequirement?.phOptimal) protege tu web de que se cuelgue ante posibles nulos si la planta no tiene ese dato. */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><FlaskConical className="w-3.5 h-3.5 text-amber-600"/> 1. pH</div>
                      <div className="font-black text-xl text-slate-800">{p.soilRequirement?.phOptimal} <span className="text-xs font-bold text-amber-700">óptimo</span></div>
                    </div>
                    {/* Parámetro 2: Textura */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-600"/> 2. Textura</div>
                      <div className="font-black text-sm text-slate-800 leading-tight pt-1">{p.soilRequirement?.textureClass}</div>
                    </div>
                    {/* Parámetro 3: Nitrógeno */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><TestTube className="w-3.5 h-3.5 text-amber-600"/> 3. Nitrógeno</div>
                      <div className="font-black text-xl text-slate-800">{p.soilRequirement?.nitrogenOptimal} <span className="text-xs font-bold text-amber-700">ppm</span></div>
                    </div>
                    {/* Parámetro 4: Fósforo */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><TestTube className="w-3.5 h-3.5 text-amber-600"/> 4. Fósforo</div>
                      <div className="font-black text-xl text-slate-800">{p.soilRequirement?.phosphorusOptimal} <span className="text-xs font-bold text-amber-700">ppm</span></div>
                    </div>
                    {/* Parámetro 5: Potasio */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><TestTube className="w-3.5 h-3.5 text-amber-600"/> 5. Potasio</div>
                      <div className="font-black text-xl text-slate-800">{p.soilRequirement?.potassiumOptimal} <span className="text-xs font-bold text-amber-700">ppm</span></div>
                    </div>
                    {/* Parámetro 6: Carbono Orgánico */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-amber-600"/> 6. Carbono Org.</div>
                      <div className="font-black text-xl text-slate-800">{p.soilRequirement?.organicCarbonOptimal} <span className="text-xs font-bold text-amber-700">%</span></div>
                    </div>
                    {/* Parámetro 7: Materia Orgánica */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><LeafyGreen className="w-3.5 h-3.5 text-amber-600"/> 7. Materia Org.</div>
                      <div className="font-black text-xl text-slate-800">{p.soilRequirement?.organicMatterOptimal} <span className="text-xs font-bold text-amber-700">%</span></div>
                    </div>
                    {/* Parámetro 8: C.I.C */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-amber-600"/> 8. C.I.C.</div>
                      <div className="font-black text-xl text-slate-800">{p.soilRequirement?.cecOptimal} <span className="text-xs font-bold text-amber-700">cm/kg</span></div>
                    </div>
                    {/* Parámetro 9: Humedad */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-amber-600"/> 9. Humedad</div>
                      <div className="font-black text-xl text-slate-800">{p.soilRequirement?.moistureOptimal} <span className="text-xs font-bold text-amber-700">%</span></div>
                    </div>
                  </div>
                </div>

                {/* 2. SECCIÓN CLIMÁTICA Y DE AMBIENTE */}
                <div className="space-y-5 pt-2">
                  <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-xl border-b-2 border-slate-200 pb-3 uppercase tracking-wider">
                    <CloudRain className="w-6 h-6 text-blue-500" /> 
                    Parámetros Ambientales
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-7 gap-x-4">
                    {/* Parámetro 10: Temperatura */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><ThermometerSun className="w-3.5 h-3.5 text-blue-500"/> 10. Temp. Prom.</div>
                      <div className="font-black text-xl text-slate-800">{p.climateRequirement?.tempOptimal} <span className="text-lg font-bold text-blue-600">°C</span></div>
                    </div>
                    {/* Parámetro 11: Lluvia / Precipitación */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-blue-500"/> 11. Precipitación</div>
                      <div className="font-black text-xl text-slate-800">{p.climateRequirement?.precipOptimal} <span className="text-xs font-bold text-blue-600">mm</span></div>
                    </div>
                    {/* Parámetro 12: Altitud */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><Mountain className="w-3.5 h-3.5 text-blue-500"/> 12. Altitud</div>
                      <div className="font-black text-xl text-slate-800">{p.climateRequirement?.altOptimal} <span className="text-xs font-bold text-blue-600">m snm</span></div>
                    </div>
                    {/* Parámetro 13: Radiación */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-blue-500"/> 13. Rad. Solar</div>
                      <div className="font-black text-xl text-slate-800">{p.climateRequirement?.solarRadOptimal} <span className="text-xs font-bold text-blue-600">MJ/m²</span></div>
                    </div>
                  </div>
                </div>

                {/* 3. SECCIÓN GEOGRÁFICA Y DE MAPEO */}
                <div className="space-y-5 pt-2">
                  <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-xl border-b-2 border-slate-200 pb-3 uppercase tracking-wider">
                    <Globe className="w-6 h-6 text-teal-600" /> 
                    Topografía y Geografía
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-7 gap-x-4">
                    {/* Parámetro 14: Pendiente Topográfica */}
                    <div className="space-y-1">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-teal-600"/> 14. Pendiente</div>
                      <div className="font-black text-xl text-slate-800">{p.locationParameter?.slopeOptimal} <span className="text-xs font-bold text-teal-700">% máx.</span></div>
                    </div>
                    {/* Parámetro 15: Rango Geográfico Longitudinal - Ocupa 2 columnas ('col-span-2') para tener más espacio visual. */}
                    <div className="space-y-1 col-span-2">
                      <div className="text-slate-500 font-bold uppercase tracking-wide text-[10px] flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal-600"/> 15. Coord. Geográficas</div>
                      <div className="font-black text-lg text-slate-800 pt-1">
                        Lat: {p.locationParameter?.latMin}° a {p.locationParameter?.latMax}°
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
