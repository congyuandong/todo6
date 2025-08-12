/**
 * 运势预测 API 路由
 * 处理运势生成、历史记录管理、收藏等功能
 */
import { Router, type Request, type Response } from 'express'
import { supabase, supabaseAdmin } from '../lib/supabase'
import { OpenAIService } from '../services/openai'
import { calculateZodiacSign } from '../../src/lib/zodiac'

const router = Router()
const openaiService = new OpenAIService()

/**
 * 生成运势预测
 * POST /api/fortune/generate
 */
router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, timeRange, fortuneType, birthDate, name } = req.body

    // 验证必填字段
    if (!userId || !timeRange || !fortuneType) {
      res.status(400).json({
        success: false,
        message: '用户ID、时间范围和运势类型为必填项'
      })
      return
    }

    // 计算星座
    let zodiacSign = ''
    if (birthDate) {
      zodiacSign = calculateZodiacSign(birthDate)
    } else {
      // 从用户表获取生日信息
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('birth_date, zodiac_sign')
        .eq('id', userId)
        .single()
      
      if (userData?.birth_date) {
        zodiacSign = userData.zodiac_sign || calculateZodiacSign(userData.birth_date)
      }
    }

    if (!zodiacSign) {
      res.status(400).json({
        success: false,
        message: '无法确定星座信息，请提供生日'
      })
      return
    }

    // 生成运势内容
    const fortuneContent = await openaiService.generateFortune({
      name,
      zodiacSign,
      timeRange: timeRange as 'daily' | 'weekly' | 'monthly',
      fortuneType: fortuneType as 'general' | 'love' | 'career' | 'wealth' | 'health'
    })

    // 保存运势记录到数据库
    const { data: fortuneRecord, error: insertError } = await supabaseAdmin
      .from('fortune_records')
      .insert({
        user_id: userId,
        zodiac_sign: zodiacSign,
        time_range: timeRange,
        fortune_type: fortuneType,
        content: fortuneContent,
        generated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('保存运势记录失败:', insertError)
      res.status(500).json({
        success: false,
        message: '保存运势记录失败'
      })
      return
    }

    res.status(200).json({
      success: true,
      message: '运势生成成功',
      fortune: fortuneRecord
    })
  } catch (error) {
    console.error('生成运势错误:', error)
    res.status(500).json({
      success: false,
      message: '生成运势失败，请稍后重试'
    })
  }
})

/**
 * 获取用户历史运势记录
 * GET /api/fortune/history/:userId
 */
router.get('/history/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params
    const { page = '1', limit = '10', timeRange, fortuneType } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const offset = (pageNum - 1) * limitNum

    // 构建查询条件
    let query = supabaseAdmin
      .from('fortune_records')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })

    if (timeRange) {
      query = query.eq('time_range', timeRange)
    }

    if (fortuneType) {
      query = query.eq('fortune_type', fortuneType)
    }

    // 获取总数
    const { count } = await supabase
      .from('fortune_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .then(result => result)

    // 获取分页数据
    const { data: records, error } = await query
      .range(offset, offset + limitNum - 1)

    if (error) {
      console.error('获取历史记录失败:', error)
      res.status(500).json({
        success: false,
        message: '获取历史记录失败'
      })
      return
    }

    res.status(200).json({
      success: true,
      data: {
        records: records || [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitNum)
        }
      }
    })
  } catch (error) {
    console.error('获取历史记录错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

/**
 * 收藏运势记录
 * POST /api/fortune/favorite
 */
router.post('/favorite', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, fortuneRecordId } = req.body

    if (!userId || !fortuneRecordId) {
      res.status(400).json({
        success: false,
        message: '用户ID和运势记录ID为必填项'
      })
      return
    }

    // 检查是否已收藏
    const { data: existingFavorite } = await supabaseAdmin
      .from('favorite_records')
      .select('id')
      .eq('user_id', userId)
      .eq('fortune_record_id', fortuneRecordId)
      .single()

    if (existingFavorite) {
      res.status(400).json({
        success: false,
        message: '该运势记录已收藏'
      })
      return
    }

    // 添加收藏记录
    const { data: favoriteRecord, error } = await supabaseAdmin
      .from('favorite_records')
      .insert({
        user_id: userId,
        fortune_record_id: fortuneRecordId,
        favorited_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('收藏失败:', error)
      res.status(500).json({
        success: false,
        message: '收藏失败'
      })
      return
    }

    res.status(200).json({
      success: true,
      message: '收藏成功',
      favorite: favoriteRecord
    })
  } catch (error) {
    console.error('收藏错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

/**
 * 取消收藏运势记录
 * DELETE /api/fortune/favorite
 */
router.delete('/favorite', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, fortuneRecordId } = req.body

    if (!userId || !fortuneRecordId) {
      res.status(400).json({
        success: false,
        message: '用户ID和运势记录ID为必填项'
      })
      return
    }

    // 删除收藏记录
    const { error } = await supabaseAdmin
      .from('favorite_records')
      .delete()
      .eq('user_id', userId)
      .eq('fortune_record_id', fortuneRecordId)

    if (error) {
      console.error('取消收藏失败:', error)
      res.status(500).json({
        success: false,
        message: '取消收藏失败'
      })
      return
    }

    res.status(200).json({
      success: true,
      message: '取消收藏成功'
    })
  } catch (error) {
    console.error('取消收藏错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

/**
 * 获取用户收藏的运势记录
 * GET /api/fortune/favorites/:userId
 */
router.get('/favorites/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params
    const { page = '1', limit = '10' } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const offset = (pageNum - 1) * limitNum

    // 获取收藏记录，关联运势记录
    const { data: favorites, error, count } = await supabaseAdmin
      .from('favorite_records')
      .select(`
        *,
        fortune_records (*)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('favorited_at', { ascending: false })
      .range(offset, offset + limitNum - 1)

    if (error) {
      console.error('获取收藏记录失败:', error)
      res.status(500).json({
        success: false,
        message: '获取收藏记录失败'
      })
      return
    }

    res.status(200).json({
      success: true,
      data: {
        favorites: favorites || [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitNum)
        }
      }
    })
  } catch (error) {
    console.error('获取收藏记录错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

/**
 * 删除运势记录
 * DELETE /api/fortune/:recordId
 */
router.delete('/:recordId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { recordId } = req.params
    const { userId } = req.body

    if (!userId) {
      res.status(400).json({
        success: false,
        message: '用户ID为必填项'
      })
      return
    }

    // 验证记录所有权
    const { data: record } = await supabaseAdmin
      .from('fortune_records')
      .select('user_id')
      .eq('id', recordId)
      .single()

    if (!record || record.user_id !== userId) {
      res.status(403).json({
        success: false,
        message: '无权限删除此记录'
      })
      return
    }

    // 先删除相关的收藏记录
    await supabaseAdmin
      .from('favorite_records')
      .delete()
      .eq('fortune_record_id', recordId)

    // 删除运势记录
    const { error } = await supabaseAdmin
      .from('fortune_records')
      .delete()
      .eq('id', recordId)

    if (error) {
      console.error('删除记录失败:', error)
      res.status(500).json({
        success: false,
        message: '删除记录失败'
      })
      return
    }

    res.status(200).json({
      success: true,
      message: '删除成功'
    })
  } catch (error) {
    console.error('删除记录错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
})

export default router