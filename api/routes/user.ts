/**
 * 用户资料管理 API 路由
 * 处理用户资料更新、偏好设置等功能
 */
import { Router, type Request, type Response } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import { calculateZodiacSign } from '../../src/lib/zodiac'

const router = Router()

/**
 * 更新用户资料
 * PUT /api/user/profile
 */
router.put('/profile', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, birthDate, birthTime, avatar } = req.body

    if (!userId) {
      res.status(400).json({
        success: false,
        message: '用户ID为必填项'
      })
      return
    }

    // 准备更新数据
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (birthDate !== undefined) {
      updateData.birth_date = birthDate
      // 重新计算星座
      if (birthDate) {
        updateData.zodiac_sign = calculateZodiacSign(birthDate)
      }
    }
    if (birthTime !== undefined) updateData.birth_time = birthTime
    if (avatar !== undefined) updateData.avatar = avatar
    
    updateData.updated_at = new Date().toISOString()

    // 更新用户资料
    const { data: userData, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('更新用户资料失败:', error)
      res.status(500).json({
        success: false,
        message: '更新用户资料失败'
      })
      return
    }

    res.status(200).json({
      success: true,
      message: '用户资料更新成功',
      user: userData
    })
  } catch (error) {
    console.error('更新用户资料错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

/**
 * 获取用户偏好设置
 * GET /api/user/preferences/:userId
 */
router.get('/preferences/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params

    const { data: preferences, error } = await supabaseAdmin
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('获取用户偏好失败:', error)
      res.status(500).json({
        success: false,
        message: '获取用户偏好失败'
      })
      return
    }

    res.status(200).json({
      success: true,
      preferences: preferences
    })
  } catch (error) {
    console.error('获取用户偏好错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

/**
 * 更新用户偏好设置
 * PUT /api/user/preferences
 */
router.put('/preferences', async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      userId, 
      defaultTimeRange, 
      defaultFortuneType, 
      notificationsEnabled, 
      theme 
    } = req.body

    if (!userId) {
      res.status(400).json({
        success: false,
        message: '用户ID为必填项'
      })
      return
    }

    // 准备更新数据
    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    
    if (defaultTimeRange !== undefined) updateData.default_time_range = defaultTimeRange
    if (defaultFortuneType !== undefined) updateData.default_fortune_type = defaultFortuneType
    if (notificationsEnabled !== undefined) updateData.notifications_enabled = notificationsEnabled
    if (theme !== undefined) updateData.theme = theme

    // 更新用户偏好
    const { data: preferences, error } = await supabaseAdmin
      .from('user_preferences')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('更新用户偏好失败:', error)
      res.status(500).json({
        success: false,
        message: '更新用户偏好失败'
      })
      return
    }

    res.status(200).json({
      success: true,
      message: '用户偏好更新成功',
      preferences: preferences
    })
  } catch (error) {
    console.error('更新用户偏好错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

/**
 * 获取用户统计信息
 * GET /api/user/stats/:userId
 */
router.get('/stats/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params

    // 获取运势记录总数
    const { count: totalFortuneRecords } = await supabaseAdmin
      .from('fortune_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // 获取收藏记录总数
    const { count: totalFavorites } = await supabaseAdmin
      .from('favorite_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // 获取最近7天的运势记录数
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { count: recentRecords } = await supabaseAdmin
      .from('fortune_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('generated_at', sevenDaysAgo.toISOString())

    // 获取各类型运势记录统计
    const { data: fortuneTypeStats } = await supabaseAdmin
      .from('fortune_records')
      .select('fortune_type')
      .eq('user_id', userId)

    // 统计各类型数量
    const typeCount = fortuneTypeStats?.reduce((acc: any, record: any) => {
      acc[record.fortune_type] = (acc[record.fortune_type] || 0) + 1
      return acc
    }, {}) || {}

    res.status(200).json({
      success: true,
      stats: {
        totalFortuneRecords: totalFortuneRecords || 0,
        totalFavorites: totalFavorites || 0,
        recentRecords: recentRecords || 0,
        fortuneTypeStats: typeCount
      }
    })
  } catch (error) {
    console.error('获取用户统计信息错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

/**
 * 删除用户账户
 * DELETE /api/user/account
 */
router.delete('/account', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body

    if (!userId) {
      res.status(400).json({
        success: false,
        message: '用户ID为必填项'
      })
      return
    }

    // 删除相关数据（按依赖关系顺序）
    // 1. 删除收藏记录
    await supabaseAdmin
      .from('favorite_records')
      .delete()
      .eq('user_id', userId)

    // 2. 删除运势记录
    await supabaseAdmin
      .from('fortune_records')
      .delete()
      .eq('user_id', userId)

    // 3. 删除用户偏好
    await supabaseAdmin
      .from('user_preferences')
      .delete()
      .eq('user_id', userId)

    // 4. 删除用户记录
    const { error: userError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)

    if (userError) {
      console.error('删除用户记录失败:', userError)
      res.status(500).json({
        success: false,
        message: '删除用户记录失败'
      })
      return
    }

    res.status(200).json({
      success: true,
      message: '账户删除成功'
    })
  } catch (error) {
    console.error('删除用户账户错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

export default router