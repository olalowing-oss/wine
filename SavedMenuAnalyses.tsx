import { useState } from 'react'
import { Calendar, MapPin, Wine, ChevronDown, ChevronUp, Trash2, Edit2, Image, X } from 'lucide-react'
import { useMenuPairings } from './useApi'
import { toast } from 'react-hot-toast'
import { supabase } from './supabase'
import { useNavigate } from 'react-router-dom'

interface MenuMatch {
  dish: string
  description?: string
  recommendedWines: {
    id: string
    name: string
    producer?: string
    type: string
    reason: string
    confidence: number
  }[]
}

export function SavedMenuAnalyses() {
  const navigate = useNavigate()
  const { data: pairings = [], isLoading, error, refetch } = useMenuPairings()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null)

  const deleteAnalysis = async (id: string, restaurantName: string) => {
    if (!confirm(`Är du säker på att du vill radera analysen för ${restaurantName}?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('menu_pairings')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Analys raderad!')
      refetch()
    } catch (err) {
      console.error('Error deleting analysis:', err)
      toast.error('Kunde inte radera analysen')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
          <p className="mt-4 text-gray-600">Laddar sparade analyser...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">Kunde inte ladda menyanalyser</p>
        <p className="text-sm text-red-600 mt-2">{error.message}</p>
      </div>
    )
  }

  if (pairings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Wine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Inga sparade analyser</h3>
        <p className="text-gray-600">
          Gå till Meny-matchning för att analysera och spara restaurangmenyer
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sparade menyanalyser</h2>
          <p className="text-gray-600">
            {pairings.length} {pairings.length === 1 ? 'analys' : 'analyser'} sparad{pairings.length !== 1 ? 'e' : ''}
          </p>
        </div>

      <div className="space-y-4">
        {pairings.map((pairing) => {
          const isExpanded = expandedId === pairing.id
          const matches = (pairing.analysis_result as { matches?: MenuMatch[] })?.matches || []

          return (
            <div key={pairing.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      {/* Image Thumbnails */}
                      <div className="flex gap-2">
                        {pairing.menu_image_url && (
                          <div className="relative">
                            <img
                              src={pairing.menu_image_url}
                              alt={`Meny för ${pairing.restaurant_name}`}
                              className="w-20 h-20 object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-80 transition-opacity hover:ring-2 hover:ring-purple-500"
                              onClick={(e) => {
                                e.stopPropagation()
                                setImageModalUrl(pairing.menu_image_url!)
                              }}
                              title="Klicka för att se menybilden"
                            />
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                              Meny
                            </div>
                          </div>
                        )}
                        {pairing.wine_list_image_url && (
                          <div className="relative">
                            <img
                              src={pairing.wine_list_image_url}
                              alt={`Vinlista för ${pairing.restaurant_name}`}
                              className="w-20 h-20 object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-80 transition-opacity hover:ring-2 hover:ring-purple-500"
                              onClick={(e) => {
                                e.stopPropagation()
                                setImageModalUrl(pairing.wine_list_image_url!)
                              }}
                              title="Klicka för att se vinlistan"
                            />
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                              Vinlista
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : pairing.id)}
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {pairing.restaurant_name}
                        </h3>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(pairing.created_at).toLocaleDateString('sv-SE', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>

                          {pairing.notes && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{pairing.notes}</span>
                            </div>
                          )}

                          <div className="flex items-center space-x-1">
                            <Wine className="w-4 h-4" />
                            <span>{matches.length} rätter</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/menu/${pairing.id}`)
                      }}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Redigera analys"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteAnalysis(pairing.id, pairing.restaurant_name)
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Radera analys"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : pairing.id)}
                      className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6" />
                      ) : (
                        <ChevronDown className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && matches.length > 0 && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="space-y-6">
                    {matches.map((match, index) => (
                      <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {match.dish}
                        </h4>
                        {match.description && (
                          <p className="text-gray-600 mb-4">{match.description}</p>
                        )}

                        <div className="space-y-4">
                          {match.recommendedWines.map((wine, wineIndex) => (
                            <div
                              key={wineIndex}
                              className="border-l-4 border-purple-500 pl-4 py-2"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h5 className="font-semibold text-gray-900">
                                    {wine.name}
                                  </h5>
                                  {wine.producer && (
                                    <p className="text-sm text-gray-600">{wine.producer}</p>
                                  )}
                                  <p className="text-sm text-purple-600">{wine.type}</p>
                                </div>
                                <div className="flex items-center space-x-1 bg-purple-100 px-3 py-1 rounded-full">
                                  <span className="text-sm font-semibold text-purple-700">
                                    {wine.confidence}%
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-700 leading-relaxed">{wine.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      </div>

      {/* Image Modal */}
      {imageModalUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setImageModalUrl(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full">
            <button
              onClick={() => setImageModalUrl(null)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              title="Stäng"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
            <img
              src={imageModalUrl}
              alt="Fullständig meny"
              className="max-w-full max-h-[90vh] object-contain mx-auto rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
}
