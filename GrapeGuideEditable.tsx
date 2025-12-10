import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Wine, ChevronDown, ChevronUp, Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { fetchGrapes, createGrape, updateGrape, deleteGrape, type Grape, type GrapeFormData } from './grapeApi'

export function GrapeGuide() {
  const location = useLocation()
  const [grapes, setGrapes] = useState<Grape[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedColor, setSelectedColor] = useState<'all' | 'red' | 'white'>('all')
  const [expandedGrape, setExpandedGrape] = useState<string | null>(null)
  const [editingGrape, setEditingGrape] = useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editMode, setEditMode] = useState(false)

  // Load grapes from database
  useEffect(() => {
    loadGrapes()
  }, [])

  const loadGrapes = async () => {
    try {
      setLoading(true)
      const data = await fetchGrapes()
      setGrapes(data)
    } catch (error: any) {
      toast.error(error.message || 'Kunde inte ladda druvor')
    } finally {
      setLoading(false)
    }
  }

  // Handle anchor navigation and auto-expand grape
  useEffect(() => {
    if (location.hash && grapes.length > 0) {
      const grapeId = location.hash.substring(1)
      const grape = grapes.find(g => g.id === grapeId)

      if (grape) {
        setExpandedGrape(grapeId)
        setTimeout(() => {
          const element = document.getElementById(grapeId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 100)
      }
    }
  }, [location.hash, grapes])

  const handleSaveGrape = async (grapeData: GrapeFormData) => {
    try {
      if (isAddingNew) {
        await createGrape(grapeData)
        toast.success('Druva tillagd!')
        setIsAddingNew(false)
      } else if (editingGrape) {
        await updateGrape(editingGrape, grapeData)
        toast.success('Druva uppdaterad!')
        setEditingGrape(null)
      }
      await loadGrapes()
    } catch (error: any) {
      toast.error(error.message || 'Kunde inte spara druva')
    }
  }

  const handleDeleteGrape = async (id: string, name: string) => {
    if (!confirm(`Är du säker på att du vill ta bort ${name}?`)) return

    try {
      await deleteGrape(id)
      toast.success('Druva borttagen!')
      await loadGrapes()
    } catch (error: any) {
      toast.error(error.message || 'Kunde inte ta bort druva')
    }
  }

  const filteredGrapes = grapes.filter(grape => {
    const matchesSearch = grape.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grape.alternative_names?.some(alt => alt.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesColor = selectedColor === 'all' || grape.color === selectedColor
    return matchesSearch && matchesColor
  })

  const redGrapes = filteredGrapes.filter(g => g.color === 'red')
  const whiteGrapes = filteredGrapes.filter(g => g.color === 'white')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Laddar druvor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Druvguide</h2>
          <p className="text-gray-600 mt-1">De vanligaste druvorna och deras egenskaper</p>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            editMode
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {editMode ? 'Avsluta redigering' : 'Redigera'}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sök druva..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedColor('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedColor === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alla ({grapes.length})
            </button>
            <button
              onClick={() => setSelectedColor('red')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedColor === 'red'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Röda ({grapes.filter(g => g.color === 'red').length})
            </button>
            <button
              onClick={() => setSelectedColor('white')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedColor === 'white'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vita ({grapes.filter(g => g.color === 'white').length})
            </button>
          </div>
        </div>
      </div>

      {/* Add New Grape Button */}
      {editMode && !isAddingNew && (
        <button
          onClick={() => setIsAddingNew(true)}
          className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Lägg till ny druva</span>
        </button>
      )}

      {/* Add New Grape Form */}
      {isAddingNew && (
        <GrapeForm
          onSave={handleSaveGrape}
          onCancel={() => setIsAddingNew(false)}
        />
      )}

      {/* Red Grapes */}
      {(selectedColor === 'all' || selectedColor === 'red') && redGrapes.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Röda druvor</h3>
          <div className="space-y-3">
            {redGrapes.map(grape => (
              editingGrape === grape.id ? (
                <GrapeForm
                  key={grape.id}
                  grape={grape}
                  onSave={handleSaveGrape}
                  onCancel={() => setEditingGrape(null)}
                />
              ) : (
                <GrapeCard
                  key={grape.id}
                  grape={grape}
                  isExpanded={expandedGrape === grape.id}
                  onToggle={() => setExpandedGrape(expandedGrape === grape.id ? null : grape.id)}
                  editMode={editMode}
                  onEdit={() => setEditingGrape(grape.id)}
                  onDelete={() => handleDeleteGrape(grape.id, grape.name)}
                />
              )
            ))}
          </div>
        </div>
      )}

      {/* White Grapes */}
      {(selectedColor === 'all' || selectedColor === 'white') && whiteGrapes.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Vita druvor</h3>
          <div className="space-y-3">
            {whiteGrapes.map(grape => (
              editingGrape === grape.id ? (
                <GrapeForm
                  key={grape.id}
                  grape={grape}
                  onSave={handleSaveGrape}
                  onCancel={() => setEditingGrape(null)}
                />
              ) : (
                <GrapeCard
                  key={grape.id}
                  grape={grape}
                  isExpanded={expandedGrape === grape.id}
                  onToggle={() => setExpandedGrape(expandedGrape === grape.id ? null : grape.id)}
                  editMode={editMode}
                  onEdit={() => setEditingGrape(grape.id)}
                  onDelete={() => handleDeleteGrape(grape.id, grape.name)}
                />
              )
            ))}
          </div>
        </div>
      )}

      {filteredGrapes.length === 0 && (
        <div className="text-center py-12">
          <Wine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Inga druvor hittades</h3>
          <p className="text-gray-600">Prova att ändra din sökning</p>
        </div>
      )}
    </div>
  )
}

function GrapeCard({
  grape,
  isExpanded,
  onToggle,
  editMode,
  onEdit,
  onDelete
}: {
  grape: Grape
  isExpanded: boolean
  onToggle: () => void
  editMode: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const colorClass = grape.color === 'red' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
  const iconColor = grape.color === 'red' ? 'text-red-600' : 'text-yellow-600'

  return (
    <div id={grape.id} className="bg-white border rounded-lg overflow-hidden transition-all">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onToggle}
          className="flex-1 flex items-center space-x-3 hover:bg-gray-50 transition-colors -m-4 p-4"
        >
          <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center border`}>
            <Wine className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-900">{grape.name}</h4>
            {grape.alternative_names && grape.alternative_names.length > 0 && (
              <p className="text-sm text-gray-500">({grape.alternative_names.join(', ')})</p>
            )}
          </div>
          <div className="ml-auto">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {editMode && (
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          <Section title="Stil & struktur" content={grape.style} />
          <Section title="Aromer & smak" content={grape.aromas} />
          <Section title="Ursprung & viktiga regioner" content={grape.origin} />
          <Section title="Vinstilar & användning" content={grape.styles} />
          <Section title="Lagringspotential" content={grape.aging} />
          <Section title="Mat & vin" content={grape.food_pairing} />
        </div>
      )}
    </div>
  )
}

function GrapeForm({
  grape,
  onSave,
  onCancel
}: {
  grape?: Grape
  onSave: (data: GrapeFormData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<GrapeFormData>({
    id: grape?.id || '',
    name: grape?.name || '',
    alternativeNames: grape?.alternative_names || [],
    color: grape?.color || 'red',
    style: grape?.style || '',
    aromas: grape?.aromas || '',
    origin: grape?.origin || '',
    styles: grape?.styles || '',
    aging: grape?.aging || '',
    foodPairing: grape?.food_pairing || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.id || !formData.name) {
      toast.error('ID och namn krävs')
      return
    }
    onSave(formData)
  }

  const handleAlternativeNamesChange = (value: string) => {
    const names = value.split(',').map(n => n.trim()).filter(n => n)
    setFormData({ ...formData, alternativeNames: names })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {grape ? 'Redigera druva' : 'Ny druva'}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID (använd kebab-case, t.ex. cabernet-sauvignon)
          </label>
          <input
            type="text"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            disabled={!!grape}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Namn</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alternativa namn (kommaseparerade)
        </label>
        <input
          type="text"
          value={formData.alternativeNames?.join(', ') || ''}
          onChange={(e) => handleAlternativeNamesChange(e.target.value)}
          placeholder="t.ex. Shiraz, Primitivo"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Färg</label>
        <select
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value as 'red' | 'white' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="red">Röd</option>
          <option value="white">Vit</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stil & struktur</label>
        <textarea
          value={formData.style}
          onChange={(e) => setFormData({ ...formData, style: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Aromer & smak</label>
        <textarea
          value={formData.aromas}
          onChange={(e) => setFormData({ ...formData, aromas: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ursprung & viktiga regioner</label>
        <textarea
          value={formData.origin}
          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vinstilar & användning</label>
        <textarea
          value={formData.styles}
          onChange={(e) => setFormData({ ...formData, styles: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Lagringspotential</label>
        <textarea
          value={formData.aging}
          onChange={(e) => setFormData({ ...formData, aging: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mat & vin</label>
        <textarea
          value={formData.foodPairing}
          onChange={(e) => setFormData({ ...formData, foodPairing: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Avbryt</span>
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Spara</span>
        </button>
      </div>
    </form>
  )
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h5 className="font-medium text-gray-900 mb-1">{title}</h5>
      <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
    </div>
  )
}
