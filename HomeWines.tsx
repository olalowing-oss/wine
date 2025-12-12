import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Wine as WineIcon, Home, MapPin, Tag, Grid, List, Star } from 'lucide-react'
import { useWines } from './useApi'
import { StarRating } from './StarRating'
import { getDisplayTags, formatPrice, getPrimaryImageURL } from './wine.utils'

export function HomeWines() {
  const { data: wines = [], isLoading, error } = useWines()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  // Filter only wines that are at home
  const homeWines = wines.filter(wine => wine.ar_hemma)

  // Further filter by search query
  const filteredWines = homeWines.filter(wine => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      wine.vin_namn.toLowerCase().includes(query) ||
      wine.producent?.toLowerCase().includes(query) ||
      wine.druva?.toLowerCase().includes(query) ||
      wine.land?.toLowerCase().includes(query) ||
      wine.region?.toLowerCase().includes(query) ||
      wine.ursprung?.toLowerCase().includes(query)
    )
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Laddar viner...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Kunde inte ladda viner</h3>
          <p className="text-gray-600 mb-4">{(error as Error).message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Viner Hemma</h2>
        <p className="text-gray-600 mt-1">
          {homeWines.length} {homeWines.length === 1 ? 'vin' : 'viner'} i hemmaförrådet
        </p>
      </div>

      {/* Search Bar */}
      {homeWines.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sök efter namn, producent, druva..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Kortvy"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Listvy"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wine Grid/List */}
      {homeWines.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Inga viner hemma</h3>
          <p className="text-gray-600 mb-6">
            Du har inga viner markerade som "Hemma" ännu
          </p>
          <Link
            to="/wines"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <span>Gå till alla viner</span>
          </Link>
        </div>
      ) : filteredWines.length === 0 ? (
        <div className="text-center py-12">
          <WineIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Inga viner hittades</h3>
          <p className="text-gray-600">Prova att ändra din sökning</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWines.map(wine => (
            <Link
              key={wine.id}
              to={`/wines/${wine.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              {/* Image */}
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {getPrimaryImageURL(wine) ? (
                  <img
                    src={getPrimaryImageURL(wine)!}
                    alt={wine.vin_namn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <WineIcon className="w-16 h-16 text-gray-300" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <Home className="w-3 h-3" />
                    <span>Hemma</span>
                  </span>
                  <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                    {wine.typ}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {wine.vin_namn}
                  </h3>
                  {wine.producent && (
                    <p className="text-sm text-gray-600 line-clamp-1">{wine.producent}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">
                      {wine.land || wine.ursprung || 'Okänt land'}
                      {wine.region && `, ${wine.region}`}
                    </span>
                  </div>
                  {wine.betyg && (
                    <StarRating
                      rating={wine.betyg}
                      onRatingChange={() => {}}
                      readonly={true}
                      size="sm"
                    />
                  )}
                </div>

                {wine.pris && (
                  <div className="text-lg font-semibold text-purple-600">
                    {formatPrice(wine.pris)}
                  </div>
                )}

                {getDisplayTags(wine.taggar).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {getDisplayTags(wine.taggar).slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center space-x-1"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                      </span>
                    ))}
                    {getDisplayTags(wine.taggar).length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{getDisplayTags(wine.taggar).length - 3} till
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(
            filteredWines.reduce((groups, wine) => {
              const type = wine.typ || 'Okänd typ'
              const country = wine.land || wine.ursprung || 'Okänt land'
              const key = `${type} - ${country}`
              if (!groups[key]) {
                groups[key] = { type, country, wines: [] }
              }
              groups[key].wines.push(wine)
              return groups
            }, {} as Record<string, { type: string; country: string; wines: typeof filteredWines }>)
          ).map(([key, group]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                    {group.type}
                  </span>
                  <span className="flex items-center space-x-1 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">{group.country}</span>
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  ({group.wines.length} {group.wines.length === 1 ? 'vin' : 'viner'})
                </span>
              </div>
              {group.wines.map(wine => (
                <Link
                  key={wine.id}
                  to={`/wines/${wine.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex items-center space-x-4 group"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {getPrimaryImageURL(wine) ? (
                      <img
                        src={getPrimaryImageURL(wine)!}
                        alt={wine.vin_namn}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <WineIcon className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                          {wine.vin_namn}
                        </h3>
                        {wine.producent && (
                          <p className="text-sm text-gray-600 truncate">{wine.producent}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        {wine.betyg && (
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium text-sm">{wine.betyg}</span>
                          </div>
                        )}
                        {wine.pris && (
                          <div className="text-sm font-semibold text-purple-600">
                            {formatPrice(wine.pris)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                        {wine.typ}
                      </span>
                      <span className="inline-flex items-center space-x-1 text-green-600">
                        <Home className="w-3 h-3" />
                        <span className="text-xs font-medium">Hemma</span>
                      </span>
                      <span className="flex items-center space-x-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="text-xs truncate">
                          {wine.land || wine.ursprung || 'Okänt land'}
                          {wine.region && `, ${wine.region}`}
                        </span>
                      </span>
                      {wine.druva && (
                        <span className="text-xs truncate">{wine.druva}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
