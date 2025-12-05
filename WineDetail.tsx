import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Edit2, Trash2, Home, MapPin, Tag, Star,
  Wine as WineIcon, ExternalLink, Loader2, Sparkles, Upload
} from 'lucide-react'
import { useWine, useUpdateWine, useDeleteWine, useWines, uploadWineImage } from './useApi'
import { openAIService } from './openai.service'
import {
  getDisplayTags,
  formatPrice,
  formatDate,
  getAllUserImages,
  getPrimaryImageURL
} from './wine.utils'
import { toast } from 'react-hot-toast'

export function WineDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: wine, isLoading } = useWine(id)
  const { data: allWines = [] } = useWines()
  const updateMutation = useUpdateWine()
  const deleteMutation = useDeleteWine()
  
  const [isEditing, setIsEditing] = useState(false)
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!wine) {
    return (
      <div className="text-center py-12">
        <WineIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Vin hittades inte</h3>
        <Link to="/wines" className="text-purple-600 hover:text-purple-700">
          Tillbaka till viner
        </Link>
      </div>
    )
  }

  const handleToggleHome = async () => {
    await updateMutation.mutateAsync({
      id: wine.id,
      updates: { ar_hemma: !wine.ar_hemma },
    })
  }

  const handleDelete = async () => {
    if (!confirm('Är du säker på att du vill radera detta vin?')) return
    
    await deleteMutation.mutateAsync(wine.id)
    navigate('/wines')
  }

  const handleGenerateRecommendations = async () => {
    setLoadingRecommendations(true)
    try {
      const recommendations = await openAIService.generateWineRecommendations(
        wine,
        allWines.filter(w => w.id !== wine.id)
      )
      
      await updateMutation.mutateAsync({
        id: wine.id,
        updates: {
          ai_recommendations: recommendations,
          recommendation_date: new Date().toISOString(),
        },
      })
      
      toast.success('Rekommendationer genererade!')
    } catch (error: any) {
      toast.error(error.message || 'Kunde inte generera rekommendationer')
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const images = getAllUserImages(wine)
  const tags = getDisplayTags(wine.taggar)

  if (isEditing) {
    return <WineEditForm wine={wine} onCancel={() => setIsEditing(false)} onSave={() => setIsEditing(false)} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/wines')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-bold text-gray-900">{wine.vin_namn}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleHome}
            className={`p-2 rounded-lg transition-colors ${
              wine.ar_hemma
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Home className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Images */}
        <div className="space-y-4">
          {images.length > 0 ? (
            <>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={getPrimaryImageURL(wine)!}
                  alt={wine.vin_namn}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.slice(1).map((img, idx) => (
                    <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={img}
                        alt={`${wine.vin_namn} ${idx + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <WineIcon className="w-24 h-24 text-gray-300" />
            </div>
          )}
        </div>

        {/* Right Column - Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {wine.typ}
              </span>
              {wine.ar_hemma && (
                <span className="inline-block ml-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Hemma
                </span>
              )}
            </div>

            {wine.producent && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Producent</h3>
                <p className="text-gray-900">{wine.producent}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Ursprung</h3>
                <div className="flex items-center space-x-2 text-gray-900">
                  <MapPin className="w-4 h-4" />
                  <span>{wine.ursprung || '-'}</span>
                </div>
              </div>

              {wine.druva && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Druva</h3>
                  <p className="text-gray-900">{wine.druva}</p>
                </div>
              )}
            </div>

            {wine.pris && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Pris</h3>
                <p className="text-2xl font-bold text-purple-600">{formatPrice(wine.pris)}</p>
              </div>
            )}

            {wine.betyg && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Betyg</h3>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= wine.betyg!
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-gray-900 font-medium">{wine.betyg}/5</span>
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Taggar</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center space-x-1"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {wine.systembolaget_lank && (
              <a
                href={wine.systembolaget_lank}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Sök på Systembolaget</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Description Sections */}
      <div className="space-y-4">
        {wine.beskrivning && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Beskrivning</h3>
            <p className="text-gray-700 whitespace-pre-line">{wine.beskrivning}</p>
          </div>
        )}

        {wine.smakanteckningar && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Smakanteckningar</h3>
            <p className="text-gray-700 whitespace-pre-line">{wine.smakanteckningar}</p>
          </div>
        )}

        {wine.servering_info && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Serveringsinformation</h3>
            <p className="text-gray-700 whitespace-pre-line">{wine.servering_info}</p>
          </div>
        )}

        {wine.serv_temperatur && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Serveringstemperatur</h3>
            <p className="text-gray-700">{wine.serv_temperatur}</p>
          </div>
        )}

        {wine.plats && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Plats</h3>
            <div className="flex items-start space-x-2">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-gray-900 font-medium">{wine.plats}</p>
                {wine.adress && <p className="text-gray-600 text-sm">{wine.adress}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>AI-rekommendationer</span>
          </h3>
          
          <button
            onClick={handleGenerateRecommendations}
            disabled={loadingRecommendations}
            className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {loadingRecommendations ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Genererar...</span>
              </>
            ) : (
              <span>Generera rekommendationer</span>
            )}
          </button>
        </div>

        {wine.ai_recommendations ? (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{wine.ai_recommendations}</p>
            {wine.recommendation_date && (
              <p className="text-sm text-gray-500 mt-4">
                Genererad: {formatDate(wine.recommendation_date)}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            Inga rekommendationer genererade än. Klicka på knappen ovan för att få AI-baserade vinrekommendationer!
          </p>
        )}
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p>Tillagt: {formatDate(wine.datum_tillagd)}</p>
        <p>Vecka: {wine.vecka}</p>
      </div>
    </div>
  )
}

// Edit Form Component
function WineEditForm({ wine, onCancel, onSave }: { wine: any; onCancel: () => void; onSave: () => void }) {
  const updateMutation = useUpdateWine()
  const [formData, setFormData] = useState({
    vin_namn: wine.vin_namn || '',
    typ: wine.typ || '',
    producent: wine.producent || '',
    ursprung: wine.ursprung || '',
    druva: wine.druva || '',
    pris: wine.pris || '',
    betyg: wine.betyg || '',
    taggar: wine.taggar || '',
    beskrivning: wine.beskrivning || '',
    smakanteckningar: wine.smakanteckningar || '',
    servering_info: wine.servering_info || '',
    serv_temperatur: wine.serv_temperatur || '',
    systembolaget_lank: wine.systembolaget_lank || '',
    plats: wine.plats || '',
    ovrigt: wine.ovrigt || '',
  })

  const [newImages, setNewImages] = useState<{ file: File; preview: string; slot: number }[]>([])
  const [uploading, setUploading] = useState(false)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Vänligen välj en bildfil')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setNewImages(prev => {
        const filtered = prev.filter(img => img.slot !== slot)
        return [...filtered, { file, preview: reader.result as string, slot }]
      })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setUploading(true)

      // Upload new images first
      const imageUpdates: any = {}
      for (const img of newImages) {
        const imageUrl = await uploadWineImage(img.file, wine.id)
        if (img.slot === 1) imageUpdates.user_image_url_1 = imageUrl
        if (img.slot === 2) imageUpdates.user_image_url_2 = imageUrl
        if (img.slot === 3) imageUpdates.user_image_url_3 = imageUrl
      }

      // Update wine data
      await updateMutation.mutateAsync({
        id: wine.id,
        updates: {
          ...formData,
          ...imageUpdates,
          pris: formData.pris ? parseFloat(formData.pris as any) : null,
          betyg: formData.betyg ? parseFloat(formData.betyg as any) : null,
        }
      })

      toast.success('Vinet uppdaterat!')
      onSave()
    } catch (error: any) {
      toast.error(error.message || 'Kunde inte uppdatera vinet')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Redigera vin</h2>
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-900"
          >
            Avbryt
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Bilder</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(slot => {
                const existingImage = slot === 1 ? wine.user_image_url_1 : slot === 2 ? wine.user_image_url_2 : wine.user_image_url_3
                const newImage = newImages.find(img => img.slot === slot)
                const displayImage = newImage?.preview || existingImage

                return (
                  <div key={slot} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bild {slot}
                    </label>
                    {displayImage ? (
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                        <img
                          src={displayImage}
                          alt={`Bild ${slot}`}
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <span className="text-white text-sm font-medium">Byt bild</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageSelect(e, slot)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="block aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors cursor-pointer">
                        <div className="h-full flex flex-col items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Ladda upp</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageSelect(e, slot)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6"></div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vinnamn *
              </label>
              <input
                type="text"
                value={formData.vin_namn}
                onChange={(e) => setFormData({ ...formData, vin_namn: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typ *
              </label>
              <select
                value={formData.typ}
                onChange={(e) => setFormData({ ...formData, typ: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Välj typ</option>
                <option value="Rött">Rött</option>
                <option value="Vitt">Vitt</option>
                <option value="Rosé">Rosé</option>
                <option value="Mousserande">Mousserande</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producent
              </label>
              <input
                type="text"
                value={formData.producent}
                onChange={(e) => setFormData({ ...formData, producent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ursprung
              </label>
              <input
                type="text"
                value={formData.ursprung}
                onChange={(e) => setFormData({ ...formData, ursprung: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Druva
              </label>
              <input
                type="text"
                value={formData.druva}
                onChange={(e) => setFormData({ ...formData, druva: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pris (kr)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.pris}
                onChange={(e) => setFormData({ ...formData, pris: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Betyg (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.betyg}
                onChange={(e) => setFormData({ ...formData, betyg: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serveringstemperatur
              </label>
              <input
                type="text"
                value={formData.serv_temperatur}
                onChange={(e) => setFormData({ ...formData, serv_temperatur: e.target.value })}
                placeholder="t.ex. 16-18°C"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taggar (kommaseparerade)
            </label>
            <input
              type="text"
              value={formData.taggar}
              onChange={(e) => setFormData({ ...formData, taggar: e.target.value })}
              placeholder="t.ex. Favorit, Sommar, Fest"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Systembolaget-länk
            </label>
            <input
              type="url"
              value={formData.systembolaget_lank}
              onChange={(e) => setFormData({ ...formData, systembolaget_lank: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plats
            </label>
            <input
              type="text"
              value={formData.plats}
              onChange={(e) => setFormData({ ...formData, plats: e.target.value })}
              placeholder="t.ex. Restaurang, Butik"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beskrivning
            </label>
            <textarea
              value={formData.beskrivning}
              onChange={(e) => setFormData({ ...formData, beskrivning: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Smakanteckningar
            </label>
            <textarea
              value={formData.smakanteckningar}
              onChange={(e) => setFormData({ ...formData, smakanteckningar: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serveringsinformation
            </label>
            <textarea
              value={formData.servering_info}
              onChange={(e) => setFormData({ ...formData, servering_info: e.target.value })}
              rows={3}
              placeholder="Passar till..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Övrigt
            </label>
            <textarea
              value={formData.ovrigt}
              onChange={(e) => setFormData({ ...formData, ovrigt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={updateMutation.isPending || uploading}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {(updateMutation.isPending || uploading) ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{uploading ? 'Laddar upp bilder...' : 'Sparar...'}</span>
                </>
              ) : (
                <span>Spara ändringar</span>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
