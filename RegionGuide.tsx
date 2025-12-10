import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, MapPin, ChevronDown, ChevronUp, Edit, Trash2, Plus, Save, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { fetchRegions, createRegion, updateRegion, deleteRegion, Region, RegionFormData } from './regionApi'

export function RegionGuide() {
  const location = useLocation()
  const [regions, setRegions] = useState<Region[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editingRegion, setEditingRegion] = useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRegions()
  }, [])

  // Handle anchor navigation and auto-expand region
  useEffect(() => {
    if (location.hash) {
      const regionId = location.hash.substring(1)
      const region = regions.find(r => r.id === regionId)
      if (region) {
        setExpandedRegion(regionId)
        setTimeout(() => {
          const element = document.getElementById(regionId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 100)
      }
    }
  }, [location.hash, regions])

  const loadRegions = async () => {
    try {
      setLoading(true)
      const data = await fetchRegions()
      setRegions(data)
    } catch (error) {
      toast.error('Kunde inte ladda regioner')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRegion = async (regionData: RegionFormData) => {
    try {
      if (isAddingNew) {
        await createRegion(regionData)
        toast.success('Region tillagd!')
        setIsAddingNew(false)
      } else if (editingRegion) {
        await updateRegion(editingRegion, regionData)
        toast.success('Region uppdaterad!')
        setEditingRegion(null)
      }
      await loadRegions()
    } catch (error) {
      toast.error('Kunde inte spara region')
    }
  }

  const handleDeleteRegion = async (id: string, name: string) => {
    if (confirm(`Är du säker på att du vill ta bort ${name}?`)) {
      try {
        await deleteRegion(id)
        toast.success('Region borttagen!')
        await loadRegions()
      } catch (error) {
        toast.error('Kunde inte ta bort region')
      }
    }
  }

  const filteredRegions = regions.filter(region => {
    const matchesSearch = region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.alternative_names?.some(alt => alt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      region.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCountry = selectedCountry === 'all' || region.country === selectedCountry
    return matchesSearch && matchesCountry
  })

  // Group by country
  const countries = Array.from(new Set(regions.map(r => r.country))).sort()
  const regionsByCountry = filteredRegions.reduce((acc, region) => {
    if (!acc[region.country]) acc[region.country] = []
    acc[region.country].push(region)
    return acc
  }, {} as Record<string, Region[]>)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Laddar regioner...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Vinregioner & Appellationer</h2>
          <p className="text-gray-600 mt-1">Upptäck världens viktigaste vinregioner</p>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            editMode
              ? 'bg-gray-200 text-gray-700'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          <Edit className="w-4 h-4" />
          <span>{editMode ? 'Avsluta redigering' : 'Redigera'}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Sök regioner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Alla länder</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add New Region Button */}
      {editMode && !isAddingNew && (
        <button
          onClick={() => setIsAddingNew(true)}
          className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Lägg till ny region</span>
        </button>
      )}

      {/* Add New Region Form */}
      {isAddingNew && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Lägg till ny region</h3>
          <RegionForm
            onSave={handleSaveRegion}
            onCancel={() => setIsAddingNew(false)}
          />
        </div>
      )}

      {/* Regions by Country */}
      <div className="space-y-8">
        {Object.entries(regionsByCountry).map(([country, countryRegions]) => (
          <div key={country}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-purple-600" />
              <span>{country}</span>
              <span className="text-sm font-normal text-gray-500">({countryRegions.length})</span>
            </h3>
            <div className="space-y-3">
              {countryRegions.map(region => (
                <RegionCard
                  key={region.id}
                  region={region}
                  isExpanded={expandedRegion === region.id}
                  onToggle={() => setExpandedRegion(expandedRegion === region.id ? null : region.id)}
                  editMode={editMode}
                  isEditing={editingRegion === region.id}
                  onEdit={() => setEditingRegion(region.id)}
                  onSave={handleSaveRegion}
                  onCancelEdit={() => setEditingRegion(null)}
                  onDelete={() => handleDeleteRegion(region.id, region.name)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredRegions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Inga regioner hittades. Prova att ändra sökning eller filter.
        </div>
      )}
    </div>
  )
}

function RegionCard({
  region,
  isExpanded,
  onToggle,
  editMode,
  isEditing,
  onEdit,
  onSave,
  onCancelEdit,
  onDelete
}: {
  region: Region
  isExpanded: boolean
  onToggle: () => void
  editMode: boolean
  isEditing: boolean
  onEdit: () => void
  onSave: (data: RegionFormData) => void
  onCancelEdit: () => void
  onDelete: () => void
}) {
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Redigera {region.name}</h3>
        <RegionForm
          region={region}
          onSave={onSave}
          onCancel={onCancelEdit}
        />
      </div>
    )
  }

  return (
    <div id={region.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h4 className="text-lg font-semibold text-gray-900">{region.name}</h4>
            {region.alternative_names && region.alternative_names.length > 0 && (
              <span className="text-sm text-gray-500">({region.alternative_names.join(', ')})</span>
            )}
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
              {region.region_type}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{region.climate}</p>
        </div>
        <div className="flex items-center space-x-2">
          {editMode && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
          <Section title="Beskrivning" content={region.description} />
          <Section title="Klimat" content={region.climate} />
          <Section title="Viktiga druvor" content={region.key_grapes} />
          <Section title="Vinstilar" content={region.wine_styles} />
          {region.notable_appellations && (
            <Section title="Kända appellationer" content={region.notable_appellations} />
          )}
          {region.classification_system && (
            <Section title="Klassificeringssystem" content={region.classification_system} />
          )}
          <Section title="Karaktärsdrag" content={region.characteristics} />
          {region.parent_region && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Del av:</span> {region.parent_region}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h5 className="font-medium text-gray-900 mb-1">{title}</h5>
      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  )
}

function RegionForm({
  region,
  onSave,
  onCancel
}: {
  region?: Region
  onSave: (data: RegionFormData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<RegionFormData>({
    id: region?.id || '',
    name: region?.name || '',
    alternativeNames: region?.alternative_names || [],
    country: region?.country || '',
    parentRegion: region?.parent_region || '',
    regionType: region?.region_type || 'region',
    climate: region?.climate || '',
    description: region?.description || '',
    keyGrapes: region?.key_grapes || '',
    wineStyles: region?.wine_styles || '',
    notableAppellations: region?.notable_appellations || '',
    classificationSystem: region?.classification_system || '',
    characteristics: region?.characteristics || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.id.trim() || !formData.name.trim() || !formData.country.trim()) {
      toast.error('ID, namn och land är obligatoriska')
      return
    }

    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID *</label>
          <input
            type="text"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            placeholder="t.ex. bordeaux, napa-valley"
            disabled={!!region}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Namn *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Land *</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="t.ex. Frankrike, Italien"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Regiontyp</label>
          <select
            value={formData.regionType}
            onChange={(e) => setFormData({ ...formData, regionType: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="country">Land</option>
            <option value="region">Region</option>
            <option value="subregion">Subregion</option>
            <option value="appellation">Appellation</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alternativa namn (kommaseparerade)</label>
        <input
          type="text"
          value={formData.alternativeNames.join(', ')}
          onChange={(e) => setFormData({
            ...formData,
            alternativeNames: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          })}
          placeholder="t.ex. Burgundy, Bourgogne"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Överliggande region</label>
        <input
          type="text"
          value={formData.parentRegion}
          onChange={(e) => setFormData({ ...formData, parentRegion: e.target.value })}
          placeholder="t.ex. Bordeaux, Bourgogne"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Klimat *</label>
        <textarea
          value={formData.climate}
          onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivning *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Viktiga druvor *</label>
        <textarea
          value={formData.keyGrapes}
          onChange={(e) => setFormData({ ...formData, keyGrapes: e.target.value })}
          rows={2}
          placeholder="Cabernet Sauvignon, Merlot, Cabernet Franc"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vinstilar *</label>
        <textarea
          value={formData.wineStyles}
          onChange={(e) => setFormData({ ...formData, wineStyles: e.target.value })}
          rows={2}
          placeholder="Kraftfulla röda viner, bordeaux-blends"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kända appellationer</label>
        <textarea
          value={formData.notableAppellations}
          onChange={(e) => setFormData({ ...formData, notableAppellations: e.target.value })}
          rows={2}
          placeholder="Pauillac, Margaux, Saint-Émilion"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Klassificeringssystem</label>
        <textarea
          value={formData.classificationSystem}
          onChange={(e) => setFormData({ ...formData, classificationSystem: e.target.value })}
          rows={2}
          placeholder="1855 års klassificering, Premier Cru, Grand Cru"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Karaktärsdrag *</label>
        <textarea
          value={formData.characteristics}
          onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
          rows={2}
          placeholder="Assemblage-tradition, långlivade viner, tydlig terroir"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Spara</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Avbryt</span>
        </button>
      </div>
    </form>
  )
}
