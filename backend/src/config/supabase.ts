import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase Error: Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
} else {
  console.log('✅ Supabase Connection: URL and Key found.');
  console.log(`URL starts with: ${supabaseUrl.substring(0, 15)}...`);
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
