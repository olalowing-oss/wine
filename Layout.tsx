import { Link, useLocation, Outlet } from 'react-router-dom'
import { Wine, Home, Menu, Upload, Plus, ChevronDown, BookOpen } from 'lucide-react'
import { useState } from 'react'

export function Layout() {
  const location = useLocation()
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showInfoMenu, setShowInfoMenu] = useState(false)

  const navItems = [
    { path: '/wines', icon: Wine, label: 'Viner' },
    { path: '/home-wines', icon: Home, label: 'Hemma' },
    { path: '/menu', icon: Menu, label: 'Meny' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar with Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title Row */}
          <div className="flex items-center h-12 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Wine className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Min Vinsamling</h1>
            </div>
          </div>

          {/* Navigation Row */}
          <nav className="flex items-center justify-between -mb-px overflow-x-auto">
            <div className="flex items-center space-x-0.5 sm:space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 border-b-2 transition-colors ${
                      isActive
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm sm:text-base hidden sm:inline">{item.label}</span>
                  </Link>
                )
              })}

              {/* Information Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowInfoMenu(!showInfoMenu)}
                  onBlur={() => setTimeout(() => setShowInfoMenu(false), 200)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 border-b-2 transition-colors ${
                    location.pathname === '/info' || location.pathname === '/regions'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium text-sm sm:text-base hidden sm:inline">Information</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showInfoMenu ? 'rotate-180' : ''}`} />
                </button>

                {showInfoMenu && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <Link
                      to="/info"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <Wine className="w-4 h-4" />
                      <span>Druvor</span>
                    </Link>
                    <Link
                      to="/regions"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Regioner</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Add Menu Dropdown - Right aligned */}
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                onBlur={() => setTimeout(() => setShowAddMenu(false), 200)}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 border-b-2 transition-colors ${
                  location.pathname === '/add' || location.pathname === '/import'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium text-sm sm:text-base hidden sm:inline">Lägg till</span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showAddMenu ? 'rotate-180' : ''}`} />
              </button>

              {showAddMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
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
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    to="/export"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Backup</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
