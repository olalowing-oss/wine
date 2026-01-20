import { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, Loader2, ExternalLink, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface LocationData {
  plats: string
  latitude: number | null
  longitude: number | null
  adress: string
}

interface LocationPickerProps {
  value: LocationData
  onChange: (location: LocationData) => void
  compact?: boolean
}

export function LocationPicker({ value, onChange, compact = false }: LocationPickerProps) {
  const [fetchingLocation, setFetchingLocation] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    if (showResults) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showResults])

  // Search for locations using Nominatim
  const searchLocation = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`
      )
      const data = await response.json()
      setSearchResults(data)
      setShowResults(true)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Kunde inte söka plats')
    } finally {
      setSearching(false)
    }
  }

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        searchLocation(searchQuery)
      }, 500)
    } else {
      setSearchResults([])
      setShowResults(false)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  const handleSelectLocation = (result: any) => {
    const placeName = result.name || result.address?.amenity || result.address?.shop || result.address?.restaurant || result.address?.house_number || ''

    onChange({
      plats: placeName,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      adress: result.display_name
    })

    setSearchQuery('')
    setShowResults(false)
    toast.success('Plats vald!')
  }

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolokalisering stöds inte i din webbläsare')
      return
    }

    setFetchingLocation(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      const { latitude, longitude } = position.coords

      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        )
        const data = await response.json()

        const placeName = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

        onChange({
          latitude,
          longitude,
          adress: placeName,
          plats: value.plats || data.name || data.address?.amenity || data.address?.shop || data.address?.restaurant || ''
        })

        toast.success('Plats hämtad!')
      } catch (error) {
        // If geocoding fails, just save coordinates
        onChange({
          ...value,
          latitude,
          longitude,
          adress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        })
        toast.success('Koordinater sparade!')
      }
    } catch (error: any) {
      if (error.code === 1) {
        toast.error('Du måste ge tillåtelse för att använda din plats')
      } else if (error.code === 2) {
        toast.error('Kunde inte hitta din plats')
      } else {
        toast.error('Kunde inte hämta plats: ' + error.message)
      }
    } finally {
      setFetchingLocation(false)
    }
  }

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Plats
          </label>
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={fetchingLocation}
            className="flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-700 disabled:opacity-50"
          >
            {fetchingLocation ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Hämtar...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3 h-3" />
                <span>Min plats</span>
              </>
            )}
          </button>
        </div>

        <input
          type="text"
          value={value.plats}
          onChange={(e) => onChange({ ...value, plats: e.target.value })}
          placeholder="t.ex. Restaurang, Butik"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        {value.adress && (
          <div className="text-xs text-gray-600">
            <MapPin className="w-3 h-3 inline mr-1" />
            {value.adress}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Sök plats
        </label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={fetchingLocation}
          className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
        >
          {fetchingLocation ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Hämtar...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              <span>Min plats</span>
            </>
          )}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative" ref={resultsRef}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sök restaurang, gata, stad..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {searching ? (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectLocation(result)}
                className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {result.name || result.display_name.split(',')[0]}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {result.display_name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {showResults && searchResults.length === 0 && searchQuery.length >= 3 && !searching && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
            Inga platser hittades
          </div>
        )}
      </div>

      {/* Selected Location Display */}
      {value.plats && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-900">{value.plats}</span>
              </div>
              {value.adress && (
                <p className="text-sm text-purple-700 ml-6">{value.adress}</p>
              )}
              {(value.latitude && value.longitude) && (
                <div className="flex items-center justify-between mt-2 ml-6">
                  <span className="text-xs text-purple-600">
                    {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
                  </span>
                  <a
                    href={`https://www.google.com/maps?q=${value.latitude},${value.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Visa karta</span>
                  </a>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => onChange({ plats: '', latitude: null, longitude: null, adress: '' })}
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              Rensa
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
