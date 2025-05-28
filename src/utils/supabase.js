import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vhvwdlspfswncioqhncm.supabase.co'; // Thay bằng URL của bạn
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZodndkbHNwZnN3bmNpb3FobmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MzE4MjYsImV4cCI6MjA1OTEwNzgyNn0.IAaPshiYoIo_5j8eDIXVZ7UVKGXn-unscAimf426638'; // Thay bằng key của bạn

export const supabase = createClient(supabaseUrl, supabaseKey);