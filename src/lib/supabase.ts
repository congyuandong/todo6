import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库类型定义
export interface User {
  id: string
  email: string
  name: string
  birth_date?: string
  birth_time?: string
  zodiac_sign?: string
  created_at: string
  updated_at: string
}

export interface FortuneRecord {
  id: string
  user_id: string
  time_range: 'daily' | 'weekly' | 'monthly'
  fortune_type: 'general' | 'love' | 'career' | 'wealth' | 'health'
  content: string
  user_info?: any
  is_favorite: boolean
  created_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  default_time_range: 'daily' | 'weekly' | 'monthly'
  default_fortune_type: 'general' | 'love' | 'career' | 'wealth' | 'health'
  notifications_enabled: boolean
  theme: 'light' | 'dark'
  updated_at: string
}

export interface FavoriteRecord {
  id: string
  user_id: string
  fortune_record_id: string
  created_at: string
}