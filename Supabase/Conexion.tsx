import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://nyrnjnktfhiiquibwqnm.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55cm5qbmt0ZmhpaXF1aWJ3cW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzExNDgsImV4cCI6MjA2NDA0NzE0OH0.wRhADlUYZeGwcJh0GQ5gRKgtAklNi7oiXphjG0iQd4w"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})