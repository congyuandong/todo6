import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Briefcase, DollarSign, Activity, Star, Calendar, Clock, RefreshCw, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react'
import { getZodiacInfo } from '../lib/zodiac'

type FortuneType = 'love' | 'career' | 'wealth' | 'health'
type TimeRange = 'daily' | 'weekly' | 'monthly'

interface FortuneData {
  type: FortuneType
  timeRange: TimeRange
  content: string
  score: number
  advice: string
  luckyNumbers: number[]
  luckyColors: string[]
  generatedAt: string
}

const FortunePage = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState<any>(null)
  const [currentType, setCurrentType] = useState<FortuneType>('love')
  const [currentTimeRange, setCurrentTimeRange] = useState<TimeRange>('daily')
  const [fortuneData, setFortuneData] = useState<FortuneData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const fortuneTypes = [
    {
      key: 'love' as FortuneType,
      icon: Heart,
      title: '爱情运势',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      key: 'career' as FortuneType,
      icon: Briefcase,
      title: '事业运势',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      key: 'wealth' as FortuneType,
      icon: DollarSign,
      title: '财运预测',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      key: 'health' as FortuneType,
      icon: Activity,
      title: '健康指数',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      gradient: 'from-orange-500 to-red-500'
    }
  ]

  const timeRanges = [
    { key: 'daily' as TimeRange, title: '今日', icon: Calendar },
    { key: 'weekly' as TimeRange, title: '本周', icon: Calendar },
    { key: 'monthly' as TimeRange, title: '本月', icon: Calendar }
  ]

  // 加载用户信息
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo')
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo))
    } else {
      // 如果没有用户信息，跳转到输入页面
      navigate('/input')
    }
  }, [])

  // 生成运势数据
  const generateFortune = async () => {
    if (!userInfo) return

    setIsLoading(true)
    try {
      // 模拟API调用生成运势内容
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockFortune: FortuneData = {
        type: currentType,
        timeRange: currentTimeRange,
        content: generateMockContent(currentType, currentTimeRange),
        score: Math.floor(Math.random() * 40) + 60, // 60-100分
        advice: generateMockAdvice(currentType),
        luckyNumbers: Array.from({ length: 3 }, () => Math.floor(Math.random() * 99) + 1),
        luckyColors: getLuckyColors(currentType),
        generatedAt: new Date().toISOString()
      }
      
      setFortuneData(mockFortune)
      setIsFavorited(false)
    } catch (error) {
      console.error('生成运势失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 生成模拟运势内容
  const generateMockContent = (type: FortuneType, timeRange: TimeRange): string => {
    const contents = {
      love: {
        daily: '今日你的爱情运势相当不错，单身的你可能会在意想不到的地方遇到心仪的对象。已有伴侣的你，与另一半的关系将更加和谐，适合进行深入的情感交流。',
        weekly: '本周你的感情生活将迎来新的转机，过去的一些误解将得到化解。对于正在寻找爱情的你，周中是最佳的表白时机。',
        monthly: '本月你的爱情运势呈上升趋势，特别是月中时期，将有重要的感情发展。建议多参加社交活动，扩大交友圈。'
      },
      career: {
        daily: '今日工作运势良好，你的创意和想法将得到上司和同事的认可。适合提出新的项目建议或申请职位晋升。',
        weekly: '本周是事业发展的关键时期，你将面临一些重要的决策。保持冷静和理性，相信自己的判断力。',
        monthly: '本月你的事业运势稳中有升，特别是在团队合作方面表现突出。可能会有新的工作机会出现。'
      },
      wealth: {
        daily: '今日财运不错，可能会有意外的收入或投资回报。但要注意控制消费，避免冲动购买。',
        weekly: '本周财运平稳，适合进行长期的理财规划。避免高风险的投资，稳健为主。',
        monthly: '本月财运呈波动状态，前半月较为平淡，后半月将有所改善。建议多关注理财信息。'
      },
      health: {
        daily: '今日身体状况良好，精力充沛。适合进行户外运动或尝试新的健身方式。',
        weekly: '本周要注意作息规律，避免熬夜。可能会有轻微的感冒症状，要及时调理。',
        monthly: '本月整体健康状况稳定，但要注意饮食均衡。建议定期进行体检，预防胜于治疗。'
      }
    }
    return contents[type][timeRange]
  }

  // 生成建议
  const generateMockAdvice = (type: FortuneType): string => {
    const advice = {
      love: '保持真诚和开放的心态，爱情需要勇气和耐心。',
      career: '专注于提升自己的专业技能，机会总是留给有准备的人。',
      wealth: '理性投资，分散风险，不要把所有鸡蛋放在一个篮子里。',
      health: '规律作息，均衡饮食，适量运动是健康的三大基石。'
    }
    return advice[type]
  }

  // 获取幸运颜色
  const getLuckyColors = (type: FortuneType): string[] => {
    const colors = {
      love: ['粉红色', '玫瑰金', '珊瑚色'],
      career: ['深蓝色', '银色', '墨绿色'],
      wealth: ['金色', '深绿色', '棕色'],
      health: ['橙色', '浅绿色', '天蓝色']
    }
    return colors[type]
  }

  // 切换运势类型
  const handleTypeChange = (type: FortuneType) => {
    setCurrentType(type)
    setFortuneData(null)
  }

  // 切换时间范围
  const handleTimeRangeChange = (timeRange: TimeRange) => {
    setCurrentTimeRange(timeRange)
    setFortuneData(null)
  }

  // 收藏/取消收藏
  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
    // 这里可以调用API保存收藏状态
  }

  // 初始加载
  useEffect(() => {
    if (userInfo) {
      generateFortune()
    }
  }, [userInfo, currentType, currentTimeRange])

  if (!userInfo) {
    return null
  }

  const currentFortuneType = fortuneTypes.find(t => t.key === currentType)!
  const zodiacInfo = userInfo.zodiacInfo

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 用户信息和星座 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{userInfo.name}</h2>
                <p className="text-gray-600">
                  {zodiacInfo?.name} · {userInfo.birthDate}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">出生地</p>
              <p className="text-gray-900">{userInfo.birthPlace}</p>
            </div>
          </div>
        </div>

        {/* 运势类型选择 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">选择运势类型</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fortuneTypes.map((type) => {
              const Icon = type.icon
              const isActive = currentType === type.key
              return (
                <button
                  key={type.key}
                  onClick={() => handleTypeChange(type.key)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    isActive
                      ? `${type.bgColor} ${type.borderColor} ${type.color}`
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{type.title}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* 时间范围选择 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">选择时间范围</h3>
          <div className="flex space-x-4">
            {timeRanges.map((range) => {
              const Icon = range.icon
              const isActive = currentTimeRange === range.key
              return (
                <button
                  key={range.key}
                  onClick={() => handleTimeRangeChange(range.key)}
                  className={`flex items-center px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-50 border-purple-200 text-purple-600'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {range.title}
                </button>
              )
            })}
          </div>
        </div>

        {/* 运势内容 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 bg-gradient-to-r ${currentFortuneType.gradient} rounded-full`}>
                <currentFortuneType.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentFortuneType.title}
                </h2>
                <p className="text-gray-600">
                  {timeRanges.find(r => r.key === currentTimeRange)?.title}运势
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={generateFortune}
                disabled={isLoading}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              {fortuneData && (
                <button
                  onClick={toggleFavorite}
                  className="p-2 text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  {isFavorited ? (
                    <BookmarkCheck className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                <span className="text-lg text-gray-600">AI正在为您生成专属运势...</span>
              </div>
            </div>
          ) : fortuneData ? (
            <div className="space-y-6">
              {/* 运势评分 */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-4xl font-bold bg-gradient-to-r ${currentFortuneType.gradient} bg-clip-text text-transparent`}>
                    {fortuneData.score}分
                  </div>
                  <p className="text-sm text-gray-600 mt-1">运势指数</p>
                </div>
              </div>

              {/* 运势内容 */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  运势解读
                </h4>
                <p className="text-gray-700 leading-relaxed">{fortuneData.content}</p>
              </div>

              {/* 建议 */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">💡 专属建议</h4>
                <p className="text-gray-700">{fortuneData.advice}</p>
              </div>

              {/* 幸运元素 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">🍀 幸运数字</h4>
                  <div className="flex space-x-3">
                    {fortuneData.luckyNumbers.map((num, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">🎨 幸运颜色</h4>
                  <div className="flex flex-wrap gap-2">
                    {fortuneData.luckyColors.map((color, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 生成时间 */}
              <div className="text-center text-sm text-gray-500">
                生成时间: {new Date(fortuneData.generatedAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">点击刷新按钮生成您的专属运势</p>
              <button
                onClick={generateFortune}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                开始预测
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FortunePage