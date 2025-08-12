import React, { useState, useEffect } from 'react'
import { Calendar, Heart, Trash2, Filter, Search, Star, Clock } from 'lucide-react'

interface FortuneRecord {
  id: string
  type: 'love' | 'career' | 'wealth' | 'health'
  timeRange: 'today' | 'week' | 'month'
  content: string
  score: number
  createdAt: string
  isFavorite: boolean
  luckyNumber: number
  luckyColor: string
}

const HistoryPage: React.FC = () => {
  const [records, setRecords] = useState<FortuneRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<FortuneRecord[]>([])
  const [filterType, setFilterType] = useState<string>('all')
  const [filterTimeRange, setFilterTimeRange] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 6

  // 模拟数据
  useEffect(() => {
    const mockRecords: FortuneRecord[] = [
      {
        id: '1',
        type: 'love',
        timeRange: 'today',
        content: '今日爱情运势不错，单身的你可能会遇到心仪的对象，有伴侣的你们感情会更加甜蜜。建议多参加社交活动，保持开放的心态。',
        score: 85,
        createdAt: '2024-01-15T10:30:00Z',
        isFavorite: true,
        luckyNumber: 7,
        luckyColor: '粉红色'
      },
      {
        id: '2',
        type: 'career',
        timeRange: 'week',
        content: '本周事业运势稳中有升，工作中会有新的机会出现。建议积极表现，展示自己的能力和才华。',
        score: 78,
        createdAt: '2024-01-14T14:20:00Z',
        isFavorite: false,
        luckyNumber: 3,
        luckyColor: '蓝色'
      },
      {
        id: '3',
        type: 'wealth',
        timeRange: 'month',
        content: '本月财运亨通，投资理财方面会有不错的收益。但要注意理性消费，避免冲动购买。',
        score: 92,
        createdAt: '2024-01-13T09:15:00Z',
        isFavorite: true,
        luckyNumber: 8,
        luckyColor: '金色'
      },
      {
        id: '4',
        type: 'health',
        timeRange: 'today',
        content: '今日健康运势良好，精神状态饱满。建议保持规律作息，适当运动，注意饮食均衡。',
        score: 88,
        createdAt: '2024-01-12T16:45:00Z',
        isFavorite: false,
        luckyNumber: 5,
        luckyColor: '绿色'
      },
      {
        id: '5',
        type: 'love',
        timeRange: 'week',
        content: '本周爱情运势波动较大，可能会遇到一些小摩擦。建议多沟通，理解对方的想法。',
        score: 65,
        createdAt: '2024-01-11T11:30:00Z',
        isFavorite: false,
        luckyNumber: 2,
        luckyColor: '紫色'
      }
    ]
    setRecords(mockRecords)
    setFilteredRecords(mockRecords)
  }, [])

  // 筛选和搜索逻辑
  useEffect(() => {
    let filtered = records

    // 按类型筛选
    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.type === filterType)
    }

    // 按时间范围筛选
    if (filterTimeRange !== 'all') {
      filtered = filtered.filter(record => record.timeRange === filterTimeRange)
    }

    // 只显示收藏
    if (showFavoritesOnly) {
      filtered = filtered.filter(record => record.isFavorite)
    }

    // 搜索
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredRecords(filtered)
    setCurrentPage(1)
  }, [records, filterType, filterTimeRange, showFavoritesOnly, searchTerm])

  // 切换收藏状态
  const toggleFavorite = (id: string) => {
    setRecords(prev => prev.map(record => 
      record.id === id ? { ...record, isFavorite: !record.isFavorite } : record
    ))
  }

  // 删除记录
  const deleteRecord = (id: string) => {
    if (window.confirm('确定要删除这条运势记录吗？')) {
      setRecords(prev => prev.filter(record => record.id !== id))
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 获取运势类型标签
  const getTypeLabel = (type: string) => {
    const labels = {
      love: '爱情',
      career: '事业',
      wealth: '财富',
      health: '健康'
    }
    return labels[type as keyof typeof labels] || type
  }

  // 获取时间范围标签
  const getTimeRangeLabel = (timeRange: string) => {
    const labels = {
      today: '今日',
      week: '本周',
      month: '本月'
    }
    return labels[timeRange as keyof typeof labels] || timeRange
  }

  // 获取运势评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // 分页逻辑
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const endIndex = startIndex + recordsPerPage
  const currentRecords = filteredRecords.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">历史记录</h1>
          <p className="text-purple-200">查看您的运势预测历史</p>
        </div>

        {/* 筛选和搜索区域 */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* 运势类型筛选 */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                运势类型
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="all">全部类型</option>
                <option value="love">爱情</option>
                <option value="career">事业</option>
                <option value="wealth">财富</option>
                <option value="health">健康</option>
              </select>
            </div>

            {/* 时间范围筛选 */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                时间范围
              </label>
              <select
                value={filterTimeRange}
                onChange={(e) => setFilterTimeRange(e.target.value)}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="all">全部时间</option>
                <option value="today">今日</option>
                <option value="week">本周</option>
                <option value="month">本月</option>
              </select>
            </div>

            {/* 搜索框 */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <Search className="inline w-4 h-4 mr-1" />
                搜索内容
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索运势内容..."
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* 收藏筛选 */}
            <div className="flex items-end">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  showFavoritesOnly
                    ? 'bg-yellow-500 text-purple-900'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`inline w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                {showFavoritesOnly ? '显示全部' : '只看收藏'}
              </button>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="text-white/80 text-sm">
            共找到 {filteredRecords.length} 条记录
          </div>
        </div>

        {/* 记录列表 */}
        {currentRecords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentRecords.map((record) => (
              <div key={record.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                {/* 记录头部 */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm font-medium">
                      {getTypeLabel(record.type)}
                    </span>
                    <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 rounded-full text-sm">
                      {getTimeRangeLabel(record.timeRange)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFavorite(record.id)}
                      className="text-white/60 hover:text-yellow-400 transition-colors duration-200"
                    >
                      <Heart className={`w-5 h-5 ${record.isFavorite ? 'fill-current text-yellow-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="text-white/60 hover:text-red-400 transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* 运势评分 */}
                <div className="flex items-center mb-3">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className={`text-lg font-bold ${getScoreColor(record.score)}`}>
                    {record.score}分
                  </span>
                  <div className="ml-3 flex-1 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${record.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* 运势内容 */}
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  {record.content}
                </p>

                {/* 幸运元素 */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <div className="text-yellow-400 text-xs mb-1">幸运数字</div>
                    <div className="text-white font-bold">{record.luckyNumber}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <div className="text-yellow-400 text-xs mb-1">幸运颜色</div>
                    <div className="text-white font-bold">{record.luckyColor}</div>
                  </div>
                </div>

                {/* 创建时间 */}
                <div className="flex items-center text-white/60 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(record.createdAt)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-2">暂无记录</div>
            <p className="text-white/40">尝试调整筛选条件或开始您的第一次运势预测</p>
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors duration-200"
            >
              上一页
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                    currentPage === page
                      ? 'bg-yellow-500 text-purple-900 font-bold'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors duration-200"
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage