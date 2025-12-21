import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase 项目地址（你给的）
 */
const SUPABASE_URL = 'https://phqqfshowwvjrptketdp.supabase.co';

/**
 * Supabase anon public key（你给的）
 * ⚠️ 这是 public key，可以安全放在前端
 */
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBocXFmc2hvd3d2anJwdGtldGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMDc2NjIsImV4cCI6MjA4MTY4MzY2Mn0.9xMrnyYXRDq9CWhE_6UKalBYIX1cL_HMvILesFYekK4';

/**
 * 永远创建 Supabase Client
 * 不再有 null，不再黑屏
 */
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
