import { Link } from 'react-router-dom'
import { Sparkles, Star, Zap, Heart, Briefcase, DollarSign, Activity } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Sparkles,
      title: '智能运势预测',
      description: '基于AI技术，为你生成个性化的星座运势',
      color: 'text-purple-600'
    },
    {
      icon: Star,
      title: '多维度分析',
      description: '涵盖爱情、事业、财运、健康四大生活领域',
      color: 'text-yellow-600'
    },
    {
      icon: Zap,
      title: '实时更新',
      description: '每日、每周、每月运势实时更新，把握最佳时机',
      color: 'text-blue-600'
    }
  ]

  const fortuneTypes = [
    {
      icon: Heart,
      title: '爱情运势',
      description: '感情生活指导',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Briefcase,
      title: '事业运势',
      description: '职场发展建议',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: DollarSign,
      title: '财运预测',
      description: '财富机遇分析',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Activity,
      title: '健康指数',
      description: '身心健康关怀',
      gradient: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* 英雄区域 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Star className="w-20 h-20 text-yellow-400 animate-pulse" />
                <div className="absolute inset-0 w-20 h-20 bg-yellow-400/20 rounded-full animate-ping" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI运势预测
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              让人工智能为你解读星座奥秘，探索未来的无限可能
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/input"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                开始预测
              </Link>
              <Link
                to="/fortune"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-full border-2 border-purple-600 hover:bg-purple-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                查看运势
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 功能特色 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            为什么选择我们？
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            结合传统星座学与现代AI技术，为你提供最准确的运势指导
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full">
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 运势类型 */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              全方位运势分析
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              从爱情到事业，从财运到健康，全面解读你的人生运势
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fortuneTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br text-white shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-90`} />
                  <div className="relative z-10">
                    <Icon className="w-8 h-8 mb-4" />
                    <h3 className="text-lg font-bold mb-2">{type.title}</h3>
                    <p className="text-sm opacity-90">{type.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 行动号召 */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            准备好探索你的命运了吗？
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            只需几分钟，就能获得专属于你的详细运势分析
          </p>
          <Link
            to="/input"
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold rounded-full hover:from-yellow-300 hover:to-orange-300 transform hover:scale-105 transition-all duration-200 shadow-lg text-lg"
          >
            <Star className="w-6 h-6 mr-2" />
            立即开始
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home