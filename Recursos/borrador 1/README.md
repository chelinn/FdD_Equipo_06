# 🌱 Base de datos para el Sistema Inteligente de Reforestación

Este sistema está construido para gestionar, clasificar y consultar parámetros científicos (suelo, clima, topografía) de múltiples especies forestales a través de una interfaz web súper moderna con soporte para imágenes auto-generadas de bases robóticas.

El proyecto está dividido en este repositorio en carpetas, pero **toda la interfaz y logísticas de bases de datos operan exclusivamente dentro de la carpeta `web/`**.

---

## 🚀 1. Instalación (Por Primera Vez)

> [!CAUTION] 
> **REQUISITO ABSOLUTO DEL SISTEMA:** Toda la arquitectura matemática y web de este proyecto funciona gracias al motor de Node.js. Antes de ejecutar algo, tienes que tener bajado e instalado **[Node.js (Versión LTS)](https://nodejs.org/)** en tu disco local. Sin esto, ningún comando funcionará.

Abre la **consola de comandos (CMD o PowerShell)**, y sigue estos pasos estrictamente en orden:

### Paso 1: Mueve tu terminal a la carpeta Web
Siempre debes operar la plataforma localizándote en su raíz.
```powershell
cd "E:\base de datos\web"
```
*(Nota: Ajusta la ruta a tu "Disco C" u otra carpeta de ser necesario en el futuro).*

### Paso 2: Descargar el Ecosistema
```powershell
npm install
```
*(Instalará Next.js, Tailwind v4, y las suites de Prisma).*

### Paso 3: Sincronizar Prisma
```powershell
npx prisma db push
```
*(Crea tu archivo interno `.db` de bases relacionales en el caso de no existir previamente).*

---

## 💻 2. Iniciar el Servidor Web (Uso Diario)

Cuando vayas a presentar tu avance al público o seguir testeando, tienes que encender tu lienzo visual en el navegador local así:

1. Entra a la consola de comandos de tu sistema en la ruta `/web/`.
   ```powershell
   cd "E:\base de datos\web"
   ```
2. Corre el motor de gráficos de Javascript:
   ```powershell
   npm run dev
   ```
3. Ahora entra a cualquier navegador como Chrome o Edge y navega escribiendo:
   👉 **`http://localhost:3000`**

*(Nota de Seguridad Inversa: Para ver el proyecto desde el navegador Safari de tu teléfono móvil, tablet u otra computadora que comparta tu misma red Wifi, solo debes teclear la IP local de tu equipo anfitrión, ejemplo: `http://192.168.18.X:3000`).*

---

## 🌍 3. Minería de Datos Automatizada (API de Texto + API de Imágenes)

**¡El catálogo botánico ahora es 100% autosuficiente!** Olvídate de añadir filas a mano en código y escribir parámetros de suelo. Ahora utilizamos el Minero DataFetcher robótico.

El Minero es un script avanzado tipo araña que tiene las siguientes utilidades:
1. **Paginación Inteligente:** Hace un análisis `count()` de las especies presentes en disco para NO repetir descargas en futuros escaneos.
2. **Descarga Botánica:** Baja ráfagas de 15 nombres científicos ultra verificados en la enciclopedia de la biodiversidad de satélite **GBIF**.
3. **Descarga de Fotos (Multimedia):** Se enruta secretamente hacia los servidores de **Wikimedia Foundation** y hace un "scraping" legal de la portada principal HD fotográfica basándose en la nomenclatura biológica estricta para ponérsela a tu web.

### 🔌 Comando Infinito de Inyección:
Basta con que lances en tu consola de siempre desde la carpeta `web` el siguiente código:
```powershell
npx tsx prisma/seed_api_miner.ts
```

Ejecuta ese comando la cantidad de veces que sea necesaria. Cada vez que termine sin errores, recarga simplemente (`F5`) en tu navegador web y verás tus nuevos árboles (con sus fotografías nativas de Wikipedia hermosamente posicionadas de fondo del diseño de la Card). 

---

## 🗄️ 4. Visualizar la Matriz Biológica (Prisma Studio)

¿Tienes que confirmar una temperatura o borrar columnas de nitrógeno como lo harías en Excel? Usa la Interfaz Gráfica sin código de Prisma:

Asegúrate de estar en `E:\base de datos\web` y ejecuta:
```powershell
npx prisma studio
```
La consola enviará la interfaz a otro puerto. Entra a tu navegador a:
👉 **`http://localhost:5555`**

Allí revisa la tabla primaria `PlantSpecies` para deleitarte viendo cómo todas las piezas químicas han encajado.

---
*Fin del Manual Técnico. Desarrollado y Escalado con 🚀 (e integración masiva de APIs).*
