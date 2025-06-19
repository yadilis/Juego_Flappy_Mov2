import { createClient } from '@supabase/supabase-js';

// Crear cliente Supabase
export const supabase = createClient(
  'https://smvgtvblaflvfbzcmngk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtdmd0dmJsYWZsdmZiemNtbmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDQzOTgsImV4cCI6MjA2NTIyMDM5OH0.GQHAPqGZLKGel2ux8DzUiMRSW7W_atSoD46pwxNYEsU'
);
