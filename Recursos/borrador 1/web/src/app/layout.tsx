// ============================================================
// ARCHIVO MAESTRO DE DISEÑO (Global Layout)
// ============================================================

// Importamos la hoja de estilos global donde inyectamos Tailwind V4
import './globals.css';

// RootLayout es el "cascarón" o "molde" que envolverá a todas las páginas web de tu proyecto.
// Todo lo que configures aquí se aplicará automáticamente a todas partes del sitio.
export default function RootLayout({
  children, // 'children' representa el contenido de cada página individual (como page.tsx)
}: {
  children: React.ReactNode;
}) {
  return (
    // 'lang="es"' le avisa a Google y a los navegadores que el texto de nuestro sistema está en Español.
    <html lang="es">
      
      {/* 
        La etiqueta <body> controla todo el fondo visual de la aplicación web.
        - className="bg-neutral-50": Pone un fondo levemente gris/hueso a TODO tu sitio.
        - text-neutral-900: Hace que todas las letras del sistema sean gris puramente oscuro.
        - font-sans: Activa el tipo de letra moderno y sin bordes antiguos de Tailwind.
      */}
      <body className="bg-neutral-50 text-neutral-900 font-sans">
        
        {/* Aquí es donde React "inyecta" mágicamente cada vez el contenido de tus páginas individuales */}
        {children}
        
      </body>
    </html>
  );
}
