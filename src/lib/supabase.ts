import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Resolve a URL da foto, preferindo o Supabase Storage se for um caminho relativo.
 */
export function getFotoUrl(path: string | null) {
  if (!path) return '/gi/placeholder-user.png';
  if (path.startsWith('http')) return path;
  
  // Se for caminho local legado (/candidatos/...), converter para Supabase Storage
  if (path.startsWith('/candidatos/')) {
    const fileName = path.split('/').pop();
    return `${supabaseUrl}/storage/v1/object/public/candidatos/${fileName}`;
  }
  
  return path;
}
