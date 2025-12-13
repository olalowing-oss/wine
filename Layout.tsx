import { Link, useLocation, Outlet } from 'react-router-dom'
import { Wine, Home, UtensilsCrossed, Upload, Plus, BookOpen } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'

export function Layout() {
  const location = useLocation()
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showInfoMenu, setShowInfoMenu] = useState(false)
  const infoMenuRef = useRef<HTMLDivElement>(null)
  const addMenuRef = useRef<HTMLDivElement>(null)

  // Stäng menyer när man byter sida
  useEffect(() => {
    setShowAddMenu(false)
    setShowInfoMenu(false)
  }, [location.pathname])

  // Optimerad click-outside handler med useCallback
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (showInfoMenu && infoMenuRef.current && !infoMenuRef.current.contains(event.target as Node)) {
      setShowInfoMenu(false)
    }
    if (showAddMenu && addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
      setShowAddMenu(false)
    }
  }, [showInfoMenu, showAddMenu])

  useEffect(() => {
    if (showInfoMenu || showAddMenu) {
      document.addEventListener('click', handleClickOutside, { passive: true })
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showInfoMenu, showAddMenu, handleClickOutside])

  const navItems = [
    { path: '/wines', icon: Wine, label: 'Viner' },
    { path: '/home-wines', icon: Home, label: 'Hemma' },
    { path: '/menu', icon: UtensilsCrossed, label: 'Meny' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Simple header - only visible on desktop */}
      <header className="bg-white border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Wine className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Min Vinsamling</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}

              {/* Information Dropdown */}
              <div className="relative" ref={infoMenuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowInfoMenu(!showInfoMenu)
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/info' || location.pathname === '/regions'
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Information</span>
                </button>

                {showInfoMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <Link
                      to="/info"
                      onClick={() => setShowInfoMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <Wine className="w-4 h-4" />
                      <span>Druvor</span>
                    </Link>
                    <Link
                      to="/regions"
                      onClick={() => setShowInfoMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Regioner</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Add Menu Dropdown */}
              <div className="relative" ref={addMenuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowAddMenu(!showAddMenu)
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/add' || location.pathname === '/import'
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Lägg till</span>
                </button>

                {showAddMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <Link
                      to="/add"
                      onClick={() => setShowAddMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nytt vin</span>
                    </Link>
                    <Link
                      to="/import"
                      onClick={() => setShowAddMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Importera</span>
                    </Link>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link
                      to="/export"
                      onClick={() => setShowAddMenu(false)}
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
        </div>
      </header>

      {/* Mobile header - simple title only */}
      <header className="bg-white border-b border-gray-200 md:hidden sticky top-0 z-10">
        <div className="flex items-center justify-center h-14">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Wine className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Min Vinsamling</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg z-50 will-change-transform">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all touch-manipulation active:scale-95 ${
                  isActive
                    ? 'text-white scale-110'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}

          {/* Information Menu */}
          <div className="relative flex-1" ref={infoMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowInfoMenu(!showInfoMenu)
              }}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all touch-manipulation active:scale-95 ${
                location.pathname === '/info' || location.pathname === '/regions'
                  ? 'text-white scale-110'
                  : 'text-white/70 hover:text-white'
              }`}
              aria-label="Information"
              aria-expanded={showInfoMenu}
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs font-medium">Info</span>
            </button>

            {showInfoMenu && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Link
                  to="/info"
                  onClick={() => setShowInfoMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors active:scale-95 touch-manipulation"
                >
                  <Wine className="w-5 h-5" />
                  <span>Druvor</span>
                </Link>
                <Link
                  to="/regions"
                  onClick={() => setShowInfoMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors active:scale-95 touch-manipulation"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Regioner</span>
                </Link>
              </div>
            )}
          </div>

          {/* Add Menu */}
          <div className="relative flex-1" ref={addMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowAddMenu(!showAddMenu)
              }}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all touch-manipulation active:scale-95 ${
                location.pathname === '/add' || location.pathname === '/import' || location.pathname === '/export'
                  ? 'text-white scale-110'
                  : 'text-white/70 hover:text-white'
              }`}
              aria-label="Lägg till"
              aria-expanded={showAddMenu}
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs font-medium">Lägg till</span>
            </button>

            {showAddMenu && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Link
                  to="/add"
                  onClick={() => setShowAddMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors active:scale-95 touch-manipulation"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nytt vin</span>
                </Link>
                <Link
                  to="/import"
                  onClick={() => setShowAddMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors active:scale-95 touch-manipulation"
                >
                  <Upload className="w-5 h-5" />
                  <span>Importera</span>
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  to="/export"
                  onClick={() => setShowAddMenu(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors active:scale-95 touch-manipulation"
                >
                  <Upload className="w-5 h-5" />
                  <span>Backup</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}
