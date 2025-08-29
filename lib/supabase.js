import { createClient } from "@supabase/supabase-js";
const c=5;
const supabaseUrl = "https://ceacilamhannrztdlimg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlYWNpbGFtaGFubnJ6dGRsaW1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NzI3NjIsImV4cCI6MjA3MTQ0ODc2Mn0.UVJWBDJfpV2BUm8vofzcy9731ZlsVWKiIiemRgzS2Hs";

export const supabase = createClient(supabaseUrl, supabaseKey);
