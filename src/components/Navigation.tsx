import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  User, 
  Sparkles, 
  History, 
  Settings, 
  Menu, 
  X,
  Star
} from 'lucide-react'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/input', icon: User, label: '信息输入' },
    { path: '/fortune', icon: Sparkles, label: '运势预测' },
    { path: '/history', icon: History, label: '历史记录' },
    { path: '/settings', icon: Settings, label: '设置' }
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <>
      {/* 移动端顶部导航栏 */}
      <div className="lg:hidden bg-gradient-to-r from-purple-900 to-purple-800 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-2">
          <Star className="w-6 h-6 text-yellow-400" />
          <h1 className="text-xl font-bold">AI运势预测</h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 移动端侧边栏 */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white transform transition-transform duration-300 ease-in-out">
          <div className="p-4 border-b border-purple-700">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-yellow-400" />
              <h1 className="text-xl font-bold">AI运势预测</h1>
            </div>
          </div>
          <nav className="mt-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-6 py-4 hover:bg-purple-700 transition-colors ${
                    isActive(item.path) ? 'bg-purple-700 border-r-4 border-yellow-400' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* 桌面端侧边栏 */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-gradient-to-b lg:from-purple-900 lg:to-purple-800 lg:text-white">
        <div className="p-6 border-b border-purple-700">
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-yellow-400" />
            <h1 className="text-2xl font-bold">AI运势预测</h1>
          </div>
          <p className="text-purple-200 text-sm mt-2">探索你的星座奥秘</p>
        </div>
        
        <nav className="flex-1 mt-6">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-6 py-4 hover:bg-purple-700 transition-colors ${
                  isActive(item.path) ? 'bg-purple-700 border-r-4 border-yellow-400' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-purple-700">
          <div className="text-center text-purple-200 text-sm">
            <p>© 2024 AI运势预测</p>
            <p className="mt-1">让AI为你解读星座密码</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navigation