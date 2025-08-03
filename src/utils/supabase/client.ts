// src/utils/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Utwórz klienta Supabase po stronie klienta (w przeglądarce)
  // Pamiętaj, aby dodać zmienne środowiskowe do Vercel!
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}