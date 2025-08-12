import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Calendar, Clock, MapPin, Save, Sparkles } from 'lucide-react'
import { calculateZodiacSign, getZodiacInfo } from '../lib/zodiac'

interface UserInfo {
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
}

const InputPage = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  })
  const [zodiacInfo, setZodiacInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<UserInfo>>({})

  // 计算星座信息
  useEffect(() => {
    if (userInfo.birthDate) {
      try {
        const zodiacSign = calculateZodiacSign(userInfo.birthDate)
        const info = getZodiacInfo(zodiacSign)
        setZodiacInfo(info)
      } catch (error) {
        setZodiacInfo(null)
      }
    } else {
      setZodiacInfo(null)
    }
  }, [userInfo.birthDate])

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Partial<UserInfo> = {}
    
    if (!userInfo.name.trim()) {
      newErrors.name = '请输入姓名'
    }
    
    if (!userInfo.birthDate) {
      newErrors.birthDate = '请选择出生日期'
    } else {
      const birthDate = new Date(userInfo.birthDate)
      const today = new Date()
      if (birthDate > today) {
        newErrors.birthDate = '出生日期不能晚于今天'
      }
    }
    
    if (!userInfo.birthTime) {
      newErrors.birthTime = '请选择出生时间'
    }
    
    if (!userInfo.birthPlace.trim()) {
      newErrors.birthPlace = '请输入出生地点'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理输入变化
  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }))
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // 保存用户信息到本地存储
      localStorage.setItem('userInfo', JSON.stringify({
        ...userInfo,
        zodiacSign: zodiacInfo?.sign,
        zodiacInfo
      }))
      
      // 跳转到运势预测页面
      navigate('/fortune')
    } catch (error) {
      console.error('保存用户信息失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            个人信息输入
          </h1>
          <p className="text-lg text-gray-600">
            请填写您的基本信息，我们将为您生成专属的运势预测
          </p>
        </div>

        {/* 表单 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 姓名输入 */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2" />
                姓名
              </label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入您的姓名"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* 出生日期 */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                出生日期
              </label>
              <input
                type="date"
                value={userInfo.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.birthDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
              )}
            </div>

            {/* 出生时间 */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                出生时间
              </label>
              <input
                type="time"
                value={userInfo.birthTime}
                onChange={(e) => handleInputChange('birthTime', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.birthTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.birthTime && (
                <p className="mt-1 text-sm text-red-600">{errors.birthTime}</p>
              )}
            </div>

            {/* 出生地点 */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                出生地点
              </label>
              <input
                type="text"
                value={userInfo.birthPlace}
                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.birthPlace ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入您的出生地点"
              />
              {errors.birthPlace && (
                <p className="mt-1 text-sm text-red-600">{errors.birthPlace}</p>
              )}
            </div>

            {/* 星座信息显示 */}
            {zodiacInfo && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  您的星座信息
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">星座</p>
                    <p className="text-lg font-medium text-purple-600">
                      {zodiacInfo.name} ({zodiacInfo.sign})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">日期范围</p>
                    <p className="text-sm text-gray-800">{zodiacInfo.dateRange}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">性格特点</p>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {zodiacInfo.traits}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  保存信息并开始预测
                </>
              )}
            </button>
          </form>
        </div>

        {/* 提示信息 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            您的个人信息将被安全保存，仅用于生成个性化的运势预测
          </p>
        </div>
      </div>
    </div>
  )
}

export default InputPage