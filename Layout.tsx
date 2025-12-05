import { Link, useLocation, Outlet } from 'react-router-dom'
import { Wine, Home, Menu, Upload } from 'lucide-react'

export function Layout() {
  const location = useLocation()

  const navItems = [
    { path: '/wines', icon: Wine, label: 'Viner' },
    { path: '/home-wines', icon: Home, label: 'Hemma' },
    { path: '/menu', icon: Menu, label: 'Meny' },
    { path: '/export', icon: Upload, label: 'Backup' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar with Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title Row */}
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Wine className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Min Vinsamling</h1>
            </div>
          </div>

          {/* Navigation Row */}
          <nav className="flex space-x-1 -mb-px">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                    isActive
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
