import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Wine, ChevronDown, ChevronUp, Edit2, Trash2, Plus, X, Save } from 'lucide-react'
import { fetchGrapes, createGrape, updateGrape, deleteGrape, type Grape, type GrapeFormData } from './grapeApi'
import { toast } from 'react-hot-toast'

export function GrapeGuide() {
  const location = useLocation()
  const [grapes, setGrapes] = useState<Grape[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedColor, setSelectedColor] = useState<'all' | 'red' | 'white'>('all')
  const [expandedGrape, setExpandedGrape] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editingGrape, setEditingGrape] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Load grapes from database
  useEffect(() => {
    loadGrapes()
  }, [])

  async function loadGrapes() {
    try {
      setLoading(true)
      const data = await fetchGrapes()
      setGrapes(data)
    } catch (error) {
      console.error('Error loading grapes:', error)
      toast.error('Kunde inte ladda druvor')
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

  const filteredGrapes = grapes.filter(grape => {
    const matchesSearch = grape.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grape.alternative_names?.some(alt => alt.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesColor = selectedColor === 'all' || grape.color === selectedColor
    return matchesSearch && matchesColor
  })

  const redGrapes = filteredGrapes.filter(g => g.color === 'red')
  const whiteGrapes = filteredGrapes.filter(g => g.color === 'white')

  async function handleDelete(id: string) {
    if (!confirm('Är du säker på att du vill ta bort denna druva?')) return

    try {
      await deleteGrape(id)
      toast.success('Druva borttagen')
      loadGrapes()
    } catch (error) {
      console.error('Error deleting grape:', error)
      toast.error('Kunde inte ta bort druva')
    }
  }

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
          <p className="text-gray-600 mt-1">{grapes.length} druvor och deras egenskaper</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              editMode
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {editMode ? 'Klar' : 'Redigera'}
          </button>
          {editMode && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Lägg till druva
            </button>
          )}
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <GrapeForm
          onSave={async (formData) => {
            try {
              await createGrape(formData as GrapeFormData)
              toast.success('Druva tillagd')
              setShowAddForm(false)
              loadGrapes()
            } catch (error) {
              console.error('Error creating grape:', error)
              toast.error('Kunde inte skapa druva')
            }
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

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

      {/* Red Grapes */}
      {(selectedColor === 'all' || selectedColor === 'red') && redGrapes.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Röda druvor ({redGrapes.length})
          </h3>
          <div className="space-y-3">
            {redGrapes.map(grape => (
              <GrapeCard
                key={grape.id}
                grape={grape}
                isExpanded={expandedGrape === grape.id}
                onToggle={() => setExpandedGrape(expandedGrape === grape.id ? null : grape.id)}
                editMode={editMode}
                isEditing={editingGrape === grape.id}
                onEdit={() => setEditingGrape(grape.id)}
                onCancelEdit={() => setEditingGrape(null)}
                onSave={async (formData) => {
                  try {
                    await updateGrape(grape.id, formData)
                    toast.success('Druva uppdaterad')
                    setEditingGrape(null)
                    loadGrapes()
                  } catch (error) {
                    console.error('Error updating grape:', error)
                    toast.error('Kunde inte uppdatera druva')
                  }
                }}
                onDelete={() => handleDelete(grape.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* White Grapes */}
      {(selectedColor === 'all' || selectedColor === 'white') && whiteGrapes.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Vita druvor ({whiteGrapes.length})
          </h3>
          <div className="space-y-3">
            {whiteGrapes.map(grape => (
              <GrapeCard
                key={grape.id}
                grape={grape}
                isExpanded={expandedGrape === grape.id}
                onToggle={() => setExpandedGrape(expandedGrape === grape.id ? null : grape.id)}
                editMode={editMode}
                isEditing={editingGrape === grape.id}
                onEdit={() => setEditingGrape(grape.id)}
                onCancelEdit={() => setEditingGrape(null)}
                onSave={async (formData) => {
                  try {
                    await updateGrape(grape.id, formData)
                    toast.success('Druva uppdaterad')
                    setEditingGrape(null)
                    loadGrapes()
                  } catch (error) {
                    console.error('Error updating grape:', error)
                    toast.error('Kunde inte uppdatera druva')
                  }
                }}
                onDelete={() => handleDelete(grape.id)}
              />
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

interface GrapeCardProps {
  grape: Grape
  isExpanded: boolean
  onToggle: () => void
  editMode: boolean
  isEditing: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onSave: (formData: Partial<GrapeFormData>) => Promise<void>
  onDelete: () => void
}

function GrapeCard({ grape, isExpanded, onToggle, editMode, isEditing, onEdit, onCancelEdit, onSave, onDelete }: GrapeCardProps) {
  const colorClass = grape.color === 'red' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
  const iconColor = grape.color === 'red' ? 'text-red-600' : 'text-yellow-600'

  if (isEditing) {
    return (
      <div id={grape.id} className="bg-white border rounded-lg overflow-hidden">
        <GrapeForm
          initialData={{
            id: grape.id,
            name: grape.name,
            alternativeNames: grape.alternative_names || [],
            color: grape.color,
            style: grape.style,
            aromas: grape.aromas,
            origin: grape.origin,
            styles: grape.styles,
            aging: grape.aging,
            foodPairing: grape.food_pairing
          }}
          onSave={onSave}
          onCancel={onCancelEdit}
        />
      </div>
    )
  }

  return (
    <div id={grape.id} className={`bg-white border rounded-lg overflow-hidden transition-all`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center border`}>
            <Wine className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-900">{grape.name}</h4>
            {grape.alternative_names && grape.alternative_names.length > 0 && (
              <p className="text-sm text-gray-500">({grape.alternative_names.join(', ')})</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {editMode && (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
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
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

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

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h5 className="font-medium text-gray-900 mb-1">{title}</h5>
      <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
    </div>
  )
}

interface GrapeFormProps {
  initialData?: GrapeFormData
  onSave: (formData: GrapeFormData | Partial<GrapeFormData>) => Promise<void>
  onCancel: () => void
}

function GrapeForm({ initialData, onSave, onCancel }: GrapeFormProps) {
  const [formData, setFormData] = useState<GrapeFormData>(
    initialData || {
      id: '',
      name: '',
      alternativeNames: [],
      color: 'red',
      style: '',
      aromas: '',
      origin: '',
      styles: '',
      aging: '',
      foodPairing: ''
    }
  )
  const [altNamesInput, setAltNamesInput] = useState(
    initialData?.alternativeNames?.join(', ') || ''
  )
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Namn krävs')
      return
    }

    if (!initialData && !formData.id.trim()) {
      // Generate ID from name for new grapes
      formData.id = formData.name.toLowerCase()
        .replace(/å/g, 'a')
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    // Parse alternative names
    const alternativeNames = altNamesInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    try {
      setSaving(true)
      await onSave({
        ...formData,
        alternativeNames: alternativeNames.length > 0 ? alternativeNames : undefined
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-gray-50">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Namn *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alternativa namn (kommaseparerade)
          </label>
          <input
            type="text"
            value={altNamesInput}
            onChange={(e) => setAltNamesInput(e.target.value)}
            placeholder="t.ex. Shiraz, Syrah"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Färg *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="red"
              checked={formData.color === 'red'}
              onChange={(e) => setFormData({ ...formData, color: e.target.value as 'red' | 'white' })}
              className="mr-2"
            />
            Röd
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="white"
              checked={formData.color === 'white'}
              onChange={(e) => setFormData({ ...formData, color: e.target.value as 'red' | 'white' })}
              className="mr-2"
            />
            Vit
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stil & struktur *
        </label>
        <textarea
          value={formData.style}
          onChange={(e) => setFormData({ ...formData, style: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Aromer & smak *
        </label>
        <textarea
          value={formData.aromas}
          onChange={(e) => setFormData({ ...formData, aromas: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ursprung & viktiga regioner *
        </label>
        <textarea
          value={formData.origin}
          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vinstilar & användning *
        </label>
        <textarea
          value={formData.styles}
          onChange={(e) => setFormData({ ...formData, styles: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lagringspotential *
        </label>
        <textarea
          value={formData.aging}
          onChange={(e) => setFormData({ ...formData, aging: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mat & vin *
        </label>
        <textarea
          value={formData.foodPairing}
          onChange={(e) => setFormData({ ...formData, foodPairing: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Sparar...' : 'Spara'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Avbryt
        </button>
      </div>
    </form>
  )
}
