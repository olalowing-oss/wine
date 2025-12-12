import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Wine as WineIcon, Home, MapPin, Tag, Grid, List } from 'lucide-react'
import { useWines } from './useApi'
import { useFilterStore } from './store'
import { StarRating } from './StarRating'
import { filterWines, getAllTags, getWineTypes, getDisplayTags, formatPrice, getPrimaryImageURL } from './wine.utils'

export function WineList() {
  const { data: wines = [], isLoading, error } = useWines()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const {
    searchQuery,
    selectedType,
    selectedTags,
    showOnlyHome,
    setSearchQuery,
    setSelectedType,
    setSelectedTags,
    setShowOnlyHome,
    clearFilters,
  } = useFilterStore()

  const filteredWines = filterWines(wines, searchQuery, selectedType, selectedTags, showOnlyHome)
  const allTags = getAllTags(wines)
  const wineTypes = getWineTypes()

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Skeleton for search bar */}
        <div className="bg-white rounded-lg shadow-sm p-3 animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg" />
        </div>

        {/* Skeleton for wine list */}
        <div className="space-y-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
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
          <p className="text-sm text-gray-500">Kontrollera att du har kört SQL-migrationen i Supabase.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-3">
        <div className="flex gap-2">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sök efter namn, producent, druva..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Kortvy"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Listvy"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              showFilters || selectedType || selectedTags.length > 0 || showOnlyHome
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            {(selectedTags.length > 0 || selectedType || showOnlyHome) && (
              <span className="bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {(selectedTags.length + (selectedType ? 1 : 0) + (showOnlyHome ? 1 : 0))}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4 space-y-4">
            {/* Wine Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vintyp</label>
              <div className="flex flex-wrap gap-2">
                {wineTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(selectedType === type ? null : type)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedType === type
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taggar</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Home Filter */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyHome}
                  onChange={(e) => setShowOnlyHome(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Visa endast viner hemma</span>
              </label>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedType || selectedTags.length > 0 || showOnlyHome) && (
              <button
                onClick={clearFilters}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Rensa alla filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Wine Grid/List */}
      {filteredWines.length === 0 ? (
        <div className="text-center py-12">
          <WineIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {wines.length === 0 ? 'Inga viner än' : 'Inga viner hittades'}
          </h3>
          <p className="text-gray-600 mb-6">
            {wines.length === 0
              ? 'Använd menyn ovan för att lägga till ditt första vin!'
              : 'Prova att ändra dina filter'}
          </p>
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
                  {wine.ar_hemma && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <Home className="w-3 h-3" />
                      <span>Hemma</span>
                    </span>
                  )}
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
        <div className="space-y-3">
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
            <div key={key} className="space-y-1.5">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="inline-flex items-center px-2 py-0.5 bg-purple-600 text-white rounded-full text-xs font-medium">
                  {group.type}
                </span>
                <span className="flex items-center gap-1 text-gray-700 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-medium">{group.country}</span>
                </span>
                <span className="text-xs text-gray-600 ml-auto">
                  ({group.wines.length})
                </span>
              </div>
              {group.wines.map(wine => (
                <Link
                  key={wine.id}
                  to={`/wines/${wine.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {getPrimaryImageURL(wine) ? (
                      <img
                        src={getPrimaryImageURL(wine)!}
                        alt={wine.vin_namn}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <WineIcon className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                          {wine.vin_namn}
                        </h3>
                        {wine.producent && (
                          <p className="text-xs text-gray-600 truncate">{wine.producent}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {wine.betyg && (
                          <StarRating
                            rating={wine.betyg}
                            onRatingChange={() => {}}
                            readonly={true}
                            size="sm"
                          />
                        )}
                        {wine.pris && (
                          <div className="text-xs font-semibold text-purple-600">
                            {formatPrice(wine.pris)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                      {wine.ar_hemma && (
                        <span className="inline-flex items-center gap-0.5 text-green-600">
                          <Home className="w-3 h-3" />
                          <span className="font-medium">Hemma</span>
                        </span>
                      )}
                      {wine.region && (
                        <span className="flex items-center gap-0.5 truncate">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{wine.region}</span>
                        </span>
                      )}
                      {wine.druva && (
                        <span className="truncate">{wine.druva}</span>
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
