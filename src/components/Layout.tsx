import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Package, MessageSquare, Menu } from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: '대시보드', href: '/', icon: Home },
    { name: '가구 관리', href: '/furniture', icon: Package },
    { name: '문의 관리', href: '/contacts', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">가조가구 관리자</h1>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} lg:block w-64 bg-white shadow-sm border-r border-gray-200 fixed lg:static inset-y-0 left-0 z-40 lg:z-auto`}>
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
