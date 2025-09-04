import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Package, MessageSquare } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()

  const navigation = [
    { name: '대시보드', href: '/', icon: Home },
    { name: '가구 관리', href: '/furniture', icon: Package },
    { name: '문의 관리', href: '/contacts', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with inline navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-3 py-2">
          <nav>
            <ul className="flex items-stretch gap-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name} className="flex-1">
                    <Link
                      to={item.href}
                      className={`flex items-center justify-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
