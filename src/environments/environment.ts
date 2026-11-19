/**
 * Configuración de Supabase para el panel de estadísticas.
 *
 * 1. Crea un proyecto gratuito en https://supabase.com
 * 2. Ve a Project Settings > API
 * 3. Copia la "Project URL" y la clave "anon public" aquí abajo
 *
 * La clave "anon" es pública por diseño. La seguridad real la dan las
 * políticas RLS incluidas en `supabase/schema.sql`.
 */
export const environment = {
  production: false,
  supabaseUrl: 'PEGA_AQUI_TU_PROJECT_URL',
  supabaseAnonKey: 'PEGA_AQUI_TU_ANON_KEY',
};
