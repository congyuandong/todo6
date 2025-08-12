import React, { useState, useEffect } from 'react'
import { User, Settings, Bell, Palette, Trash2, Save, Edit3, Calendar, MapPin, Clock } from 'lucide-react'
import { calculateZodiacSign, getZodiacInfo } from '../lib/zodiac'

interface UserProfile {
  id: string
  name: string
  email: string
  birthDate: string
  birthTime: string
  birthPlace: string
  avatar?: string
  zodiacSign: string
}

interface UserPreferences {
  defaultTimeRange: 'today' | 'week' | 'month'
  defaultFortuneType: 'love' | 'career' | 'wealth' | 'health'
  notificationsEnabled: boolean
  theme: 'light' | 'dark' | 'auto'
}

interface UserStats {
  totalRecords: number
  totalFavorites: number
  recentRecords: number
  typeStats: {
    love: number
    career: number
    wealth: number
    health: number
  }
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'stats' | 'account'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    birthDate: '1990-06-15',
    birthTime: '14:30',
    birthPlace: '北京市',
    zodiacSign: '双子座'
  })
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultTimeRange: 'today',
    defaultFortuneType: 'love',
    notificationsEnabled: true,
    theme: 'auto'
  })
  const [stats, setStats] = useState<UserStats>({
    totalRecords: 25,
    totalFavorites: 8,
    recentRecords: 5,
    typeStats: {
      love: 8,
      career: 6,
      wealth: 7,
      health: 4
    }
  })
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile)

  // 更新编辑中的资料
  useEffect(() => {
    setEditedProfile(profile)
  }, [profile])

  // 保存用户资料
  const saveProfile = () => {
    // 重新计算星座
    const zodiacSign = calculateZodiacSign(editedProfile.birthDate)
    const updatedProfile = { ...editedProfile, zodiacSign }
    
    setProfile(updatedProfile)
    setIsEditing(false)
    // 这里应该调用API保存到后端
    console.log('保存用户资料:', updatedProfile)
  }

  // 保存偏好设置
  const savePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences)
    // 这里应该调用API保存到后端
    console.log('保存偏好设置:', newPreferences)
  }

  // 删除账户
  const deleteAccount = () => {
    if (window.confirm('确定要删除账户吗？此操作不可恢复，将删除您的所有数据。')) {
      if (window.confirm('请再次确认删除账户操作')) {
        // 这里应该调用API删除账户
        console.log('删除账户')
        alert('账户删除成功')
      }
    }
  }

  // 获取星座信息
  const zodiacInfo = getZodiacInfo(profile.zodiacSign)

  // 标签页内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* 头像和基本信息 */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="头像" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{profile.name}</h2>
              <p className="text-purple-200">{profile.email}</p>
            </div>

            {/* 星座信息 */}
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                ⭐ 星座信息
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-yellow-400 text-sm mb-1">星座</div>
                  <div className="text-white font-medium">{profile.zodiacSign}</div>
                </div>
                <div>
                  <div className="text-yellow-400 text-sm mb-1">日期范围</div>
                  <div className="text-white font-medium">{zodiacInfo?.dateRange}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-yellow-400 text-sm mb-1">性格特点</div>
                  <div className="text-white/90 text-sm">{zodiacInfo?.description}</div>
                </div>
              </div>
            </div>

            {/* 个人资料表单 */}
            <div className="bg-white/10 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">个人资料</h3>
                <button
                  onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-yellow-500 text-purple-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200"
                >
                  {isEditing ? (
                    <><Save className="w-4 h-4 mr-2" />保存</>
                  ) : (
                    <><Edit3 className="w-4 h-4 mr-2" />编辑</>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    姓名
                  </label>
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    出生日期
                  </label>
                  <input
                    type="date"
                    value={editedProfile.birthDate}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, birthDate: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    出生时间
                  </label>
                  <input
                    type="time"
                    value={editedProfile.birthTime}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, birthTime: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    出生地点
                  </label>
                  <input
                    type="text"
                    value={editedProfile.birthPlace}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, birthPlace: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="请输入出生地点"
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'preferences':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">偏好设置</h2>

            {/* 默认设置 */}
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">默认设置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    默认时间范围
                  </label>
                  <select
                    value={preferences.defaultTimeRange}
                    onChange={(e) => savePreferences({ ...preferences, defaultTimeRange: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="today">今日</option>
                    <option value="week">本周</option>
                    <option value="month">本月</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    默认运势类型
                  </label>
                  <select
                    value={preferences.defaultFortuneType}
                    onChange={(e) => savePreferences({ ...preferences, defaultFortuneType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="love">爱情</option>
                    <option value="career">事业</option>
                    <option value="wealth">财富</option>
                    <option value="health">健康</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 通知设置 */}
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                通知设置
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">启用通知</div>
                  <div className="text-white/70 text-sm">接收运势提醒和更新通知</div>
                </div>
                <button
                  onClick={() => savePreferences({ ...preferences, notificationsEnabled: !preferences.notificationsEnabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    preferences.notificationsEnabled ? 'bg-yellow-500' : 'bg-white/30'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      preferences.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 主题设置 */}
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                主题设置
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: '浅色', icon: '☀️' },
                  { value: 'dark', label: '深色', icon: '🌙' },
                  { value: 'auto', label: '自动', icon: '🔄' }
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => savePreferences({ ...preferences, theme: theme.value as any })}
                    className={`p-4 rounded-lg text-center transition-all duration-200 ${
                      preferences.theme === theme.value
                        ? 'bg-yellow-500 text-purple-900'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <div className="text-2xl mb-2">{theme.icon}</div>
                    <div className="font-medium">{theme.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'stats':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">使用统计</h2>

            {/* 总体统计 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{stats.totalRecords}</div>
                <div className="text-purple-200">总运势记录</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{stats.totalFavorites}</div>
                <div className="text-yellow-200">收藏记录</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/30 to-teal-500/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{stats.recentRecords}</div>
                <div className="text-green-200">近7天记录</div>
              </div>
            </div>

            {/* 类型统计 */}
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">运势类型统计</h3>
              <div className="space-y-4">
                {Object.entries(stats.typeStats).map(([type, count]) => {
                  const typeLabels = {
                    love: { label: '爱情', color: 'from-pink-500 to-red-500', icon: '💕' },
                    career: { label: '事业', color: 'from-blue-500 to-indigo-500', icon: '💼' },
                    wealth: { label: '财富', color: 'from-yellow-500 to-orange-500', icon: '💰' },
                    health: { label: '健康', color: 'from-green-500 to-teal-500', icon: '🌿' }
                  }
                  const typeInfo = typeLabels[type as keyof typeof typeLabels]
                  const percentage = (count / stats.totalRecords) * 100

                  return (
                    <div key={type} className="flex items-center space-x-4">
                      <div className="text-2xl">{typeInfo.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white font-medium">{typeInfo.label}</span>
                          <span className="text-white/70 text-sm">{count} 次 ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${typeInfo.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case 'account':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">账户管理</h2>

            {/* 账户信息 */}
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">账户信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">用户ID</span>
                  <span className="text-white font-mono">{profile.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">注册邮箱</span>
                  <span className="text-white">{profile.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">账户状态</span>
                  <span className="text-green-400">正常</span>
                </div>
              </div>
            </div>

            {/* 数据管理 */}
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">数据管理</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
                  <div>
                    <div className="text-white font-medium">导出数据</div>
                    <div className="text-white/70 text-sm">下载您的所有运势记录和设置</div>
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                    导出
                  </button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
                  <div>
                    <div className="text-white font-medium">清除缓存</div>
                    <div className="text-white/70 text-sm">清除本地存储的临时数据</div>
                  </div>
                  <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200">
                    清除
                  </button>
                </div>
              </div>
            </div>

            {/* 危险操作 */}
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
                <Trash2 className="w-5 h-5 mr-2" />
                危险操作
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-white font-medium mb-2">删除账户</div>
                  <div className="text-white/70 text-sm mb-4">
                    永久删除您的账户和所有相关数据。此操作不可恢复，请谨慎操作。
                  </div>
                  <button
                    onClick={deleteAccount}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                  >
                    删除账户
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">设置</h1>
          <p className="text-purple-200">管理您的个人资料和应用偏好</p>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'profile', label: '个人资料', icon: User },
              { key: 'preferences', label: '偏好设置', icon: Settings },
              { key: 'stats', label: '使用统计', icon: Bell },
              { key: 'account', label: '账户管理', icon: Trash2 }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === key
                    ? 'bg-yellow-500 text-purple-900'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 标签页内容 */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage