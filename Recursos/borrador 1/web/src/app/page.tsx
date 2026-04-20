// ============================================================
// REDIRECCIONADOR PRINCIPAL TÉCNICO (Entry Point)
// ============================================================

// Importamos la función nativa de Next.js que nos ayuda a redirigir (enviar al usuario) a otra página.
import { redirect } from 'next/navigation';

// Este es el componente principal que se carga al entrar a "http://localhost:3000/" vacío.
export default function Home() {
  // En lugar de mostrar una pantalla de inicio en blanco, le ordenamos al código
  // que salte directa y automáticamente hacia nuestro panel "/plantas".
  redirect('/plantas');
}
