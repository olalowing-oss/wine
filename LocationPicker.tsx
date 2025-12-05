import { useState } from 'react'
import { MapPin, Navigation, Loader2, ExternalLink } from 'lucide-react'
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
          Platsinformation
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
              <span>Hämtar plats...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              <span>Använd min nuvarande plats</span>
            </>
          )}
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Platsnamn
        </label>
        <input
          type="text"
          value={value.plats}
          onChange={(e) => onChange({ ...value, plats: e.target.value })}
          placeholder="t.ex. Restaurang, Butik"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {value.adress && (
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Adress
          </label>
          <input
            type="text"
            value={value.adress}
            onChange={(e) => onChange({ ...value, adress: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      )}

      {(value.latitude && value.longitude) && (
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Koordinater: {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
          </div>
          <a
            href={`https://www.google.com/maps?q=${value.latitude},${value.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-700"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Visa i Google Maps</span>
          </a>
        </div>
      )}
    </div>
  )
}
