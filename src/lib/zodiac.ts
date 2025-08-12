// 星座计算工具函数

export interface ZodiacSign {
  name: string
  englishName: string
  symbol: string
  dateRange: string
  element: string
  description: string
}

// 十二星座信息
export const zodiacSigns: Record<string, ZodiacSign> = {
  aries: {
    name: '白羊座',
    englishName: 'Aries',
    symbol: '♈',
    dateRange: '3月21日 - 4月19日',
    element: '火象星座',
    description: '热情、积极、勇敢'
  },
  taurus: {
    name: '金牛座',
    englishName: 'Taurus',
    symbol: '♉',
    dateRange: '4月20日 - 5月20日',
    element: '土象星座',
    description: '稳重、务实、可靠'
  },
  gemini: {
    name: '双子座',
    englishName: 'Gemini',
    symbol: '♊',
    dateRange: '5月21日 - 6月20日',
    element: '风象星座',
    description: '聪明、好奇、善变'
  },
  cancer: {
    name: '巨蟹座',
    englishName: 'Cancer',
    symbol: '♋',
    dateRange: '6月21日 - 7月22日',
    element: '水象星座',
    description: '温柔、体贴、感性'
  },
  leo: {
    name: '狮子座',
    englishName: 'Leo',
    symbol: '♌',
    dateRange: '7月23日 - 8月22日',
    element: '火象星座',
    description: '自信、大方、领导力强'
  },
  virgo: {
    name: '处女座',
    englishName: 'Virgo',
    symbol: '♍',
    dateRange: '8月23日 - 9月22日',
    element: '土象星座',
    description: '细致、完美主义、分析力强'
  },
  libra: {
    name: '天秤座',
    englishName: 'Libra',
    symbol: '♎',
    dateRange: '9月23日 - 10月22日',
    element: '风象星座',
    description: '优雅、平衡、社交能力强'
  },
  scorpio: {
    name: '天蝎座',
    englishName: 'Scorpio',
    symbol: '♏',
    dateRange: '10月23日 - 11月21日',
    element: '水象星座',
    description: '神秘、专注、洞察力强'
  },
  sagittarius: {
    name: '射手座',
    englishName: 'Sagittarius',
    symbol: '♐',
    dateRange: '11月22日 - 12月21日',
    element: '火象星座',
    description: '自由、乐观、爱冒险'
  },
  capricorn: {
    name: '摩羯座',
    englishName: 'Capricorn',
    symbol: '♑',
    dateRange: '12月22日 - 1月19日',
    element: '土象星座',
    description: '务实、有责任心、目标明确'
  },
  aquarius: {
    name: '水瓶座',
    englishName: 'Aquarius',
    symbol: '♒',
    dateRange: '1月20日 - 2月18日',
    element: '风象星座',
    description: '独立、创新、人道主义'
  },
  pisces: {
    name: '双鱼座',
    englishName: 'Pisces',
    symbol: '♓',
    dateRange: '2月19日 - 3月20日',
    element: '水象星座',
    description: '浪漫、直觉、富有同情心'
  }
}

/**
 * 根据生日计算星座
 * @param birthDate 生日字符串，格式：YYYY-MM-DD
 * @returns 星座英文名称
 */
export function calculateZodiacSign(birthDate: string): string {
  const date = new Date(birthDate)
  const month = date.getMonth() + 1 // getMonth() 返回 0-11
  const day = date.getDate()

  // 根据月份和日期判断星座
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return 'aries'
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return 'taurus'
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return 'gemini'
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return 'cancer'
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return 'leo'
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return 'virgo'
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return 'libra'
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return 'scorpio'
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return 'sagittarius'
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return 'capricorn'
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return 'aquarius'
  } else {
    return 'pisces'
  }
}

/**
 * 获取星座信息
 * @param zodiacKey 星座英文名称
 * @returns 星座信息对象
 */
export function getZodiacInfo(zodiacKey: string): ZodiacSign | null {
  return zodiacSigns[zodiacKey] || null
}

/**
 * 获取所有星座列表
 * @returns 星座列表数组
 */
export function getAllZodiacSigns(): Array<{ key: string; info: ZodiacSign }> {
  return Object.entries(zodiacSigns).map(([key, info]) => ({ key, info }))
}

/**
 * 验证生日格式
 * @param birthDate 生日字符串
 * @returns 是否为有效格式
 */
export function isValidBirthDate(birthDate: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(birthDate)) {
    return false
  }
  
  const date = new Date(birthDate)
  const now = new Date()
  
  // 检查日期是否有效且不超过当前日期
  return date instanceof Date && !isNaN(date.getTime()) && date <= now
}