import { ReactNode } from 'react'
import Navigation from './Navigation'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Navigation />
      
      {/* 主内容区域 */}
      <div className="lg:ml-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout