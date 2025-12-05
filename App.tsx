import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Layout } from './Layout'
import { WineList } from './WineList'
import { WineDetail } from './WineDetail'
import { AddWine } from './AddWine'
import { ImportWines } from './ImportWines'
import { HomeWines } from './HomeWines'

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
            <Route path="wines/add" element={<AddWine />} />
            <Route path="wines/import" element={<ImportWines />} />
            <Route path="wines/:id" element={<WineDetail />} />
            <Route path="home-wines" element={<HomeWines />} />
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
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Backup & Export</h2>
      <p className="text-gray-600">Exportera din vinsamling till JSON eller CSV</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Denna vy kommer att låta dig exportera all data till olika format för säkerhetskopiering
        </p>
      </div>
    </div>
  )
}

export default App
