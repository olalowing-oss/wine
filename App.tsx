import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster, toast } from 'react-hot-toast'
import { useState } from 'react'
import { Layout } from './Layout'
import { WineList } from './WineList'
import { WineDetail } from './WineDetail'
import { AddWine } from './AddWine'
import { ImportWines } from './ImportWines'
import { HomeWines } from './HomeWines'
import { GrapeGuide } from './GrapeGuide'
import { RegionGuide } from './RegionGuide'
import { useWines } from './useApi'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/wines" replace />} />
            <Route path="wines" element={<WineList />} />
            <Route path="add" element={<AddWine />} />
            <Route path="import" element={<ImportWines />} />
            <Route path="wines/:id" element={<WineDetail />} />
            <Route path="home-wines" element={<HomeWines />} />
            <Route path="info" element={<GrapeGuide />} />
            <Route path="regions" element={<RegionGuide />} />
            <Route path="menu" element={<MenuView />} />
            <Route path="export" element={<ExportView />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}

// Placeholder components for routes not yet created
function MenuView() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Meny & Vin</h2>
      <p className="text-gray-600">Analysera restaurangmenyer och få vinrekommendationer</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Denna vy kommer att låta dig ladda upp bilder av restaurangmenyer och få AI-baserade vinrekommendationer
        </p>
      </div>
    </div>
  )
}

function ExportView() {
  const { data: wines = [] } = useWines()
  const [exporting, setExporting] = useState(false)

  const handleExportJSON = () => {
    setExporting(true)
    try {
      const dataStr = JSON.stringify(wines, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `vinsamling-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Backup skapad som JSON!')
    } catch (error) {
      toast.error('Kunde inte skapa backup')
    } finally {
      setExporting(false)
    }
  }

  const handleExportCSV = () => {
    setExporting(true)
    try {
      // CSV headers
      const headers = [
        'Namn', 'Typ', 'Producent', 'Land', 'Region', 'Druva',
        'Pris', 'Betyg', 'Hemma', 'Systembolaget Nr', 'Plats', 'Datum tillagd'
      ]

      // Convert wines to CSV rows
      const rows = wines.map((wine: any) => [
        wine.vin_namn,
        wine.typ,
        wine.producent || '',
        wine.land || wine.ursprung || '',
        wine.region || '',
        wine.druva || '',
        wine.pris || '',
        wine.betyg || '',
        wine.ar_hemma ? 'Ja' : 'Nej',
        wine.systembolaget_nr || '',
        wine.plats || '',
        wine.datum_tillagd ? new Date(wine.datum_tillagd).toLocaleDateString('sv-SE') : ''
      ])

      // Create CSV string
      const csvContent = [
        headers.join(','),
        ...rows.map((row: any) => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n')

      const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `vinsamling-backup-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Backup skapad som CSV!')
    } catch (error) {
      toast.error('Kunde inte skapa backup')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Backup & Export</h2>
        <p className="text-gray-600 mt-1">Exportera din vinsamling ({wines.length} viner)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* JSON Export */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">JSON-format</h3>
              <p className="text-sm text-gray-600">Komplett backup med all data</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Exportera all data i JSON-format. Perfekt för fullständiga säkerhetskopior och
            för att importera data till andra system.
          </p>
          <button
            onClick={handleExportJSON}
            disabled={exporting || wines.length === 0}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{exporting ? 'Exporterar...' : 'Ladda ner JSON'}</span>
          </button>
        </div>

        {/* CSV Export */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">CSV-format</h3>
              <p className="text-sm text-gray-600">Öppna i Excel/Google Sheets</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Exportera i CSV-format för att öppna i Excel, Google Sheets eller andra
            kalkylprogram. Bra för analys och rapporter.
          </p>
          <button
            onClick={handleExportCSV}
            disabled={exporting || wines.length === 0}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{exporting ? 'Exporterar...' : 'Ladda ner CSV'}</span>
          </button>
        </div>
      </div>

      {wines.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Du har inga viner att exportera. Lägg till viner först!
          </p>
        </div>
      )}
    </div>
  )
}

export default App
