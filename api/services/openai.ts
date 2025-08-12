import OpenAI from 'openai'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 星座映射
const zodiacSigns = {
  'aries': '白羊座',
  'taurus': '金牛座',
  'gemini': '双子座',
  'cancer': '巨蟹座',
  'leo': '狮子座',
  'virgo': '处女座',
  'libra': '天秤座',
  'scorpio': '天蝎座',
  'sagittarius': '射手座',
  'capricorn': '摩羯座',
  'aquarius': '水瓶座',
  'pisces': '双鱼座'
}

// 运势类型映射
const fortuneTypes = {
  'general': '综合运势',
  'love': '爱情运势',
  'career': '事业运势',
  'wealth': '财运',
  'health': '健康运势'
}

// 时间范围映射
const timeRanges = {
  'daily': '今日',
  'weekly': '本周',
  'monthly': '本月'
}

interface FortuneRequest {
  name: string
  zodiacSign: string
  birthDate?: string
  timeRange: 'daily' | 'weekly' | 'monthly'
  fortuneType: 'general' | 'love' | 'career' | 'wealth' | 'health'
}

export class OpenAIService {
  /**
   * 生成运势预测
   */
  async generateFortune(request: FortuneRequest): Promise<string> {
    try {
      const { name, zodiacSign, birthDate, timeRange, fortuneType } = request
      
      const zodiacChinese = zodiacSigns[zodiacSign as keyof typeof zodiacSigns] || zodiacSign
      const fortuneTypeChinese = fortuneTypes[fortuneType]
      const timeRangeChinese = timeRanges[timeRange]
      
      const prompt = this.buildPrompt({
        name,
        zodiacSign: zodiacChinese,
        birthDate,
        timeRange: timeRangeChinese,
        fortuneType: fortuneTypeChinese
      })

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "你是一位专业的占星师和运势预测专家，擅长根据星座、生日等信息为用户提供准确、有趣且富有指导意义的运势预测。你的预测风格温暖、积极，既有娱乐性又有实用价值。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.8,
      })

      return completion.choices[0]?.message?.content || '暂时无法生成运势预测，请稍后再试。'
    } catch (error) {
      console.error('OpenAI API 调用失败:', error)
      throw new Error('运势预测生成失败，请检查 API 配置或稍后重试')
    }
  }

  /**
   * 构建运势预测提示词
   */
  private buildPrompt(params: {
    name: string
    zodiacSign: string
    birthDate?: string
    timeRange: string
    fortuneType: string
  }): string {
    const { name, zodiacSign, birthDate, timeRange, fortuneType } = params
    
    let prompt = `请为 ${name}（${zodiacSign}）生成${timeRange}的${fortuneType}预测。`
    
    if (birthDate) {
      prompt += `生日：${birthDate}。`
    }
    
    prompt += `\n\n要求：
1. 内容要积极正面，富有指导意义
2. 语言温暖亲切，避免过于神秘或恐怖的表述
3. 提供具体的建议和行动指南
4. 字数控制在200-300字之间
5. 结构清晰，包含运势分析和实用建议
6. 体现${zodiacSign}的性格特点
`
    
    // 根据运势类型添加特定要求
    switch (params.fortuneType) {
      case '爱情运势':
        prompt += '7. 重点关注感情关系、桃花运、恋爱建议等方面\n'
        break
      case '事业运势':
        prompt += '7. 重点关注工作发展、职场关系、事业机会等方面\n'
        break
      case '财运':
        prompt += '7. 重点关注财务状况、投资理财、收入机会等方面\n'
        break
      case '健康运势':
        prompt += '7. 重点关注身体健康、精神状态、养生建议等方面\n'
        break
      default:
        prompt += '7. 综合分析各个方面的运势，给出全面的指导\n'
    }
    
    return prompt
  }

  /**
   * 检查 OpenAI API 连接状态
   */
  async checkConnection(): Promise<boolean> {
    try {
      await openai.models.list()
      return true
    } catch (error) {
      console.error('OpenAI API 连接检查失败:', error)
      return false
    }
  }
}

export const openaiService = new OpenAIService()