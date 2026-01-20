import { Link, useLocation, Outlet } from 'react-router-dom'
import { Wine, Home, UtensilsCrossed, Upload, Plus, BookOpen } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'

export function Layout() {
  const location = useLocation()
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showInfoMenu, setShowInfoMenu] = useState(false)
  const [showMenuMenu, setShowMenuMenu] = useState(false)
  const infoMenuRef = useRef<HTMLDivElement>(null)
  const addMenuRef = useRef<HTMLDivElement>(null)
  const menuMenuRef = useRef<HTMLDivElement>(null)

  // Stäng menyer när man byter sida
  useEffect(() => {
    setShowAddMenu(false)
    setShowInfoMenu(false)
    setShowMenuMenu(false)
  }, [location.pathname])

  // Optimerad click-outside handler med useCallback
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (showInfoMenu && infoMenuRef.current && !infoMenuRef.current.contains(event.target as Node)) {
      setShowInfoMenu(false)
    }
    if (showAddMenu && addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
      setShowAddMenu(false)
    }
    if (showMenuMenu && menuMenuRef.current && !menuMenuRef.current.contains(event.target as Node)) {
      setShowMenuMenu(false)
    }
  }, [showInfoMenu, showAddMenu, showMenuMenu])

  useEffect(() => {
    if (showInfoMenu || showAddMenu || showMenuMenu) {
      document.addEventListener('click', handleClickOutside, { passive: true })
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showInfoMenu, showAddMenu, showMenuMenu, handleClickOutside])

  const navItems = [
    { path: '/wines', icon: Wine, label: 'Viner' },
    { path: '/home-wines', icon: Home, label: 'Hemma' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Unified header for both desktop and mobile */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 transform-gpu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Wine className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Min Vinsamling</h1>
              <h1 className="text-lg font-bold text-gray-900 sm:hidden">Vinsamling</h1>
            </div>

            {/* Navigation for all screen sizes */}
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all touch-manipulation active:scale-95 ${
                      isActive
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm sm:text-base hidden sm:inline">{item.label}</span>
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
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all touch-manipulation active:scale-95 ${
                    location.pathname === '/info' || location.pathname === '/regions'
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="Information"
                  aria-expanded={showInfoMenu}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium text-sm sm:text-base hidden sm:inline">Information</span>
                </button>

                {showInfoMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <Link
                      to="/info"
                      onClick={() => setShowInfoMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors active:scale-95 touch-manipulation"
                    >
                      <Wine className="w-4 h-4" />
                      <span>Druvor</span>
                    </Link>
                    <Link
                      to="/regions"
                      onClick={() => setShowInfoMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors active:scale-95 touch-manipulation"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Regioner</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Meny Dropdown */}
              <div className="relative" ref={menuMenuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenuMenu(!showMenuMenu)
                  }}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all touch-manipulation active:scale-95 ${
                    location.pathname === '/menu' || location.pathname === '/saved-menus'
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="Meny"
                  aria-expanded={showMenuMenu}
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  <span className="font-medium text-sm sm:text-base hidden sm:inline">Meny</span>
                </button>

                {showMenuMenu && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <Link
                      to="/menu"
                      onClick={() => setShowMenuMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors active:scale-95 touch-manipulation"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ny meny-analys</span>
                    </Link>
                    <Link
                      to="/saved-menus"
                      onClick={() => setShowMenuMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors active:scale-95 touch-manipulation"
                    >
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>Sparade menyer</span>
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
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-all touch-manipulation active:scale-95 ${
                    location.pathname === '/add' || location.pathname === '/import' || location.pathname === '/export'
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="Lägg till"
                  aria-expanded={showAddMenu}
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium text-sm sm:text-base hidden sm:inline">Lägg till</span>
                </button>

                {showAddMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <Link
                      to="/add"
                      onClick={() => setShowAddMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors active:scale-95 touch-manipulation"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nytt vin</span>
                    </Link>
                    <Link
                      to="/import"
                      onClick={() => setShowAddMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors active:scale-95 touch-manipulation"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Importera</span>
                    </Link>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link
                      to="/export"
                      onClick={() => setShowAddMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors active:scale-95 touch-manipulation"
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


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
