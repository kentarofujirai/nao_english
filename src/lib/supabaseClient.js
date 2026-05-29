import { createClient } from '@supabase/supabase-js'

// 開発環境では Vite の dev サーバーを中継してプロキシをバイパスする
const supabaseUrl = import.meta.env.DEV
  ? `${window.location.origin}/supabase-api`
  : import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
