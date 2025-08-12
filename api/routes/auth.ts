/**
 * 用户认证 API 路由
 * 处理用户注册、登录、登出等功能
 */
import { Router, type Request, type Response } from 'express'
import { supabase, supabaseAdmin } from '../lib/supabase'
import { calculateZodiacSign } from '../../src/lib/zodiac'

const router = Router()

/**
 * 用户注册
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, birthDate, birthTime } = req.body

    // 验证必填字段
    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        message: '邮箱、密码和姓名为必填项'
      })
      return
    }

    // 使用 Supabase Auth 注册用户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      res.status(400).json({
        success: false,
        message: authError.message
      })
      return
    }

    if (!authData.user) {
      res.status(400).json({
        success: false,
        message: '用户创建失败'
      })
      return
    }

    // 计算星座
    let zodiacSign = ''
    if (birthDate) {
      zodiacSign = calculateZodiacSign(birthDate)
    }

    // 在用户表中创建用户记录
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        birth_date: birthDate || null,
        birth_time: birthTime || null,
        zodiac_sign: zodiacSign || null
      })
      .select()
      .single()

    if (userError) {
      console.error('创建用户记录失败:', userError)
      res.status(500).json({
        success: false,
        message: '用户信息保存失败'
      })
      return
    }

    // 创建用户偏好设置
    await supabaseAdmin
      .from('user_preferences')
      .insert({
        user_id: authData.user.id,
        default_time_range: 'daily',
        default_fortune_type: 'general',
        notifications_enabled: true,
        theme: 'light'
      })

    res.status(201).json({
      success: true,
      message: '注册成功',
      user: userData,
      session: authData.session
    })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // 验证必填字段
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: '邮箱和密码为必填项'
      })
      return
    }

    // 使用 Supabase Auth 登录
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      })
      return
    }

    if (!authData.user) {
      res.status(401).json({
        success: false,
        message: '登录失败'
      })
      return
    }

    // 获取用户详细信息
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (userError) {
      console.error('获取用户信息失败:', userError)
    }

    res.status(200).json({
      success: true,
      message: '登录成功',
      user: userData,
      session: authData.session
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

/**
 * 用户登出
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      })
      return
    }

    const token = authHeader.replace('Bearer ', '')
    
    // 使用 Supabase Auth 登出
    const { error } = await supabase.auth.admin.signOut(token)

    if (error) {
      console.error('登出错误:', error)
      res.status(400).json({
        success: false,
        message: '登出失败'
      })
      return
    }

    res.status(200).json({
      success: true,
      message: '登出成功'
    })
  } catch (error) {
    console.error('登出错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

/**
 * 获取当前用户信息
 * GET /api/auth/me
 */
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      })
      return
    }

    const token = authHeader.replace('Bearer ', '')
    
    // 验证令牌并获取用户信息
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      res.status(401).json({
        success: false,
        message: '无效的认证令牌'
      })
      return
    }

    // 获取用户详细信息
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('获取用户信息失败:', userError)
      res.status(500).json({
        success: false,
        message: '获取用户信息失败'
      })
      return
    }

    res.status(200).json({
      success: true,
      user: userData
    })
  } catch (error) {
    console.error('获取用户信息错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

export default router