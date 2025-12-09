import { Link, useLocation, Outlet } from 'react-router-dom'
import { Wine, Home, Menu, Upload, Plus, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function Layout() {
  const location = useLocation()
  const [showAddMenu, setShowAddMenu] = useState(false)

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
          <nav className="flex items-center space-x-1 -mb-px">
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

            {/* Add Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                onBlur={() => setTimeout(() => setShowAddMenu(false), 200)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                  location.pathname === '/add' || location.pathname === '/import'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Lägg till</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAddMenu ? 'rotate-180' : ''}`} />
              </button>

              {showAddMenu && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <Link
                    to="/add"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nytt vin</span>
                  </Link>
                  <Link
                    to="/import"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Importera</span>
                  </Link>
                </div>
              )}
            </div>
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
