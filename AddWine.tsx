import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, FileText, ArrowLeft, Upload, Loader2 } from 'lucide-react'
import { useCreateWine, useUpdateWine, uploadWineImage } from './useApi'
import { openAIService } from './openai.service'
import { generateSystembolagetLink, getCurrentWeek, imageToBase64 } from './wine.utils'
import { toast } from 'react-hot-toast'
import { LocationPicker } from './LocationPicker'
import type { WineInfo } from './wine.types'

type AddMode = 'choose' | 'image' | 'text'

export function AddWine() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AddMode>('choose')
  const [loading, setLoading] = useState(false)
  
  // Image mode states
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // Text mode states
  const [textDescription, setTextDescription] = useState('')
  
  // Analyzed wine info
  const [wineInfo, setWineInfo] = useState<WineInfo | null>(null)

  // Location info
  const [location, setLocation] = useState({
    plats: '',
    latitude: null as number | null,
    longitude: null as number | null,
    adress: ''
  })

  const createWineMutation = useCreateWine()
  const updateWineMutation = useUpdateWine()

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Vänligen välj en bildfil')
      return
    }

    setSelectedImage(file)
    
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return

    setLoading(true)
    try {
      const base64 = await imageToBase64(selectedImage)
      const info = await openAIService.analyzeWineLabel(base64)
      setWineInfo(info)
      toast.success('Etikett analyserad!')
    } catch (error: any) {
      toast.error(error.message || 'Kunde inte analysera bilden')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeText = async () => {
    if (!textDescription.trim()) {
      toast.error('Skriv en beskrivning först')
      return
    }

    setLoading(true)
    try {
      const info = await openAIService.analyzeWineFromText(textDescription)
      setWineInfo(info)
      toast.success('Text analyserad!')
    } catch (error: any) {
      toast.error(error.message || 'Kunde inte analysera texten')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveWine = async () => {
    if (!wineInfo) return

    setLoading(true)
    try {
      // Create wine in database
      const newWine = await createWineMutation.mutateAsync({
        vecka: getCurrentWeek(),
        vin_namn: wineInfo.name,
        typ: wineInfo.type,
        datum_tillagd: new Date().toISOString(),
        producent: wineInfo.producer || '',
        ursprung: wineInfo.country, // Keep for backwards compatibility
        land: wineInfo.country,
        region: wineInfo.region || '',
        druva: wineInfo.grapes || '',
        taggar: '',
        pris: null,
        betyg: null,
        systembolaget_nr: null,
        serv_temperatur: wineInfo.servingTemperature || null,
        systembolaget_lank: generateSystembolagetLink(wineInfo.name),
        plats: location.plats || null,
        latitude: location.latitude,
        longitude: location.longitude,
        adress: location.adress || null,
        beskrivning: wineInfo.description || null,
        smakanteckningar: wineInfo.tastingNotes || null,
        servering_info: wineInfo.foodPairing || null,
        ovrigt: null,
        ar_hemma: false,
        ai_recommendations: null,
        recommendation_date: null,
        user_image_url_1: null,
        user_image_url_2: null,
        user_image_url_3: null,
      })

      // Upload image if available
      if (selectedImage && mode === 'image') {
        try {
          const imageUrl = await uploadWineImage(selectedImage, newWine.id)
          await updateWineMutation.mutateAsync({
            id: newWine.id,
            updates: {
              user_image_url_1: imageUrl,
            }
          })
        } catch (error) {
          console.error('Failed to upload image:', error)
        }
      }

      navigate(`/wines/${newWine.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Kunde inte spara vinet')
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'choose') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/wines')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Lägg till vin</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Image Mode */}
          <button
            onClick={() => setMode('image')}
            className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-all group"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <Camera className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Från bild</h3>
            <p className="text-gray-600">
              Ta en bild av vinetiketten och låt AI analysera den
            </p>
          </button>

          {/* Text Mode */}
          <button
            onClick={() => setMode('text')}
            className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-all group"
          >
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
              <FileText className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Från text</h3>
            <p className="text-gray-600">
              Beskriv vinet med text och låt AI fylla i informationen
            </p>
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'image') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => wineInfo ? setWineInfo(null) : setMode('choose')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Lägg till från bild</h2>
        </div>

        {!wineInfo ? (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {/* Image Upload */}
            {!imagePreview ? (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-purple-500 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Klicka för att välja bild</p>
                  <p className="text-sm text-gray-500">eller dra och släpp</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full rounded-lg"
                />
                <div className="flex gap-4">
                  <label className="flex-1">
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50">
                      Byt bild
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleAnalyzeImage}
                    disabled={loading}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyserar...</span>
                      </>
                    ) : (
                      <span>Analysera etikett</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <WineInfoForm
            wineInfo={wineInfo}
            onSave={handleSaveWine}
            loading={loading}
            location={location}
            onLocationChange={setLocation}
          />
        )}
      </div>
    )
  }

  if (mode === 'text') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => wineInfo ? setWineInfo(null) : setMode('choose')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Lägg till från text</h2>
        </div>

        {!wineInfo ? (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beskriv vinet
              </label>
              <textarea
                value={textDescription}
                onChange={(e) => setTextDescription(e.target.value)}
                placeholder="T.ex: Château Margaux 2015, rött vin från Bordeaux, Frankrike"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleAnalyzeText}
              disabled={loading || !textDescription.trim()}
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyserar...</span>
                </>
              ) : (
                <span>Analysera beskrivning</span>
              )}
            </button>
          </div>
        ) : (
          <WineInfoForm
            wineInfo={wineInfo}
            onSave={handleSaveWine}
            loading={loading}
            location={location}
            onLocationChange={setLocation}
          />
        )}
      </div>
    )
  }

  return null
}

// Wine Info Form Component
function WineInfoForm({
  wineInfo,
  onSave,
  loading,
  location,
  onLocationChange,
}: {
  wineInfo: WineInfo
  onSave: () => void
  loading: boolean
  location: {
    plats: string
    latitude: number | null
    longitude: number | null
    adress: string
  }
  onLocationChange: (location: any) => void
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Vinnamn</h3>
          <p className="text-gray-700">{wineInfo.name}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Typ</h3>
            <p className="text-gray-700">{wineInfo.type}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Producent</h3>
            <p className="text-gray-700">{wineInfo.producer || '-'}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Land</h3>
            <p className="text-gray-700">{wineInfo.country}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Region</h3>
            <p className="text-gray-700">{wineInfo.region || '-'}</p>
          </div>
        </div>

        {wineInfo.grapes && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Druvor</h3>
            <p className="text-gray-700">{wineInfo.grapes}</p>
          </div>
        )}

        {wineInfo.description && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Beskrivning</h3>
            <p className="text-gray-700">{wineInfo.description}</p>
          </div>
        )}

        {wineInfo.tastingNotes && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Smakanteckningar</h3>
            <p className="text-gray-700">{wineInfo.tastingNotes}</p>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <LocationPicker
            value={location}
            onChange={onLocationChange}
            compact={true}
          />
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={loading}
        className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sparar...</span>
          </>
        ) : (
          <span>Spara vin</span>
        )}
      </button>
    </div>
  )
}
