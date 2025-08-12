import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// 创建服务端客户端（具有管理员权限）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 创建普通客户端（用于用户认证）
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6dm5pd3pjeW53enVtZ2Fram9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODM0MzMsImV4cCI6MjA2ODY1OTQzM30.W-YML-H8gaepcy8FsSom2V5eQU3BTjNzoiitH3zuT0I'
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