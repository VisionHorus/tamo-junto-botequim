
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = "https://dsmzcxsahdnsmyuhwany.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbXpjeHNhaGRuc215dWh3YW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTI1NzUsImV4cCI6MjEwMDQ4ODU3NX0.2PNcu3KKhCz01b-o9n6u9rAF5z1389ag5Sb1ERmYXb8";
// Mude a forma de criar o cliente para usar o createClient que importamos
export const supabaseConfig = createClient(supabaseUrl, supabaseKey );
