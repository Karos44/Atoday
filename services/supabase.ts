
import { createClient } from '@supabase/supabase-js';

// 使用用户提供的 Supabase 配置进行初始化
const supabaseUrl = 'https://phqqfshowwvjrptketdp.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBocXFmc2hvd3d2anJwdGtldGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMDc2NjIsImV4cCI6MjA4MTY4MzY2Mn0.9xMrnyYXRDq9CWhE_6UKalBYIX1cL_HMvILesFYekK4';

// 封装初始化过程
const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase 配置缺失。系统目前处于 [演示模式]。");
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error("Supabase 初始化失败:", e);
    return null;
  }
};

export const supabase = getSupabaseClient();
