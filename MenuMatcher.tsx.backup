import { useState } from 'react'
import { Upload, Wine, Sparkles, X, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useWines } from './useApi'

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

export function MenuMatcher() {
  const { data: wines = [] } = useWines()
  const [menuFile, setMenuFile] = useState<File | null>(null)
  const [menuPreview, setMenuPreview] = useState<string | null>(null)
  const [wineListFile, setWineListFile] = useState<File | null>(null)
  const [wineListPreview, setWineListPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [matches, setMatches] = useState<MenuMatch[]>([])

  const handleMenuFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if it's an image
    if (file.type.startsWith('image/')) {
      setMenuFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setMenuPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else if (file.type === 'application/pdf' || file.type === 'text/plain') {
      setMenuFile(file)
      setMenuPreview(null)
    } else {
      toast.error('Vänligen ladda upp en bild, PDF eller textfil')
    }
  }

  const handleWineListFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if it's an image
    if (file.type.startsWith('image/')) {
      setWineListFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setWineListPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else if (file.type === 'application/pdf' || file.type === 'text/plain') {
      setWineListFile(file)
      setWineListPreview(null)
    } else {
      toast.error('Vänligen ladda upp en bild, PDF eller textfil')
    }
  }

  const analyzeWithAI = async () => {
    if (!menuFile) {
      toast.error('Vänligen ladda upp en meny först')
      return
    }

    setAnalyzing(true)
    try {
      // Convert files to base64 for API
      const menuContent = await fileToBase64(menuFile)
      let wineListContent = null

      if (wineListFile) {
        wineListContent = await fileToBase64(wineListFile)
      }

      // Call your AI API here
      const response = await fetch('/api/match-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuFile: {
            content: menuContent,
            type: menuFile.type,
            name: menuFile.name,
          },
          wineListFile: wineListFile ? {
            content: wineListContent,
            type: wineListFile.type,
            name: wineListFile.name,
          } : null,
          availableWines: wines.map(w => ({
            id: w.id,
            name: w.vin_namn,
            producer: w.producent,
            type: w.typ,
            grape: w.druva,
            region: w.region,
            country: w.land || w.ursprung,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API error:', response.status, errorData)

        // Show specific error message
        if (errorData.error?.includes('API key not configured')) {
          toast.error('OpenAI API-nyckel saknas. Visar demo-data istället.')
        } else if (response.status === 404) {
          toast.error('API-endpoint hittades inte (404). Kontrollera att /api/match-menu är deployad.')
        } else {
          const errorMsg = errorData.error || errorData.message || 'Okänt fel'
          console.error('Full error:', errorMsg, errorData)
          toast.error(`AI-analys misslyckades: ${errorMsg}. Visar demo-data.`, { duration: 5000 })
        }

        // Show demo data
        throw new Error('Using demo data')
      }

      const data = await response.json()
      setMatches(data.matches)
      toast.success('Analys klar!')
    } catch (error) {
      console.error('Error analyzing menu:', error)

      // Demo data for development and when API is not configured
      setMatches([
        {
          dish: 'Grillad lax med citronsmör',
          description: 'Färsk lax från Östersjön med hemlagat citronsmör',
          recommendedWines: [
            {
              id: 'demo-1',
              name: 'Chardonnay',
              producer: 'Domaine Leflaive',
              type: 'Vitt vin',
              reason: 'Den krämiga strukturen i Chardonnay kompletterar den feta laxen perfekt, medan syran balanserar citronsmöret.',
              confidence: 95,
            },
          ],
        },
        {
          dish: 'Oxfilé med rödvinssås',
          description: 'Högrevsbiff med klassisk rödvinssås och rotfrukter',
          recommendedWines: [
            {
              id: 'demo-2',
              name: 'Cabernet Sauvignon',
              type: 'Rött vin',
              reason: 'Fyllig Cabernet Sauvignon med kraftiga tanniner står upp mot den kraftfulla kötträtten och harmonierar med rödvinssåsen.',
              confidence: 98,
            },
          ],
        },
      ])
    } finally {
      setAnalyzing(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const clearFiles = () => {
    setMenuFile(null)
    setMenuPreview(null)
    setWineListFile(null)
    setWineListPreview(null)
    setMatches([])
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Menu Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Restaurangmeny</h3>
              <p className="text-sm text-gray-600">Ladda upp meny (bild, PDF eller text)</p>
            </div>
          </div>

          {!menuFile ? (
            <label className="block">
              <input
                type="file"
                accept="image/*,.pdf,.txt"
                onChange={handleMenuFileChange}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Klicka för att ladda upp meny</p>
                <p className="text-sm text-gray-500 mt-1">Stödjer bilder, PDF och textfiler</p>
              </div>
            </label>
          ) : (
            <div className="space-y-3">
              {menuPreview ? (
                <img
                  src={menuPreview}
                  alt="Menu preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="bg-gray-100 rounded-lg p-4 flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{menuFile.name}</p>
                    <p className="text-sm text-gray-500">{(menuFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => {
                  setMenuFile(null)
                  setMenuPreview(null)
                }}
                className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Ta bort</span>
              </button>
            </div>
          )}
        </div>

        {/* Wine List Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Wine className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Vinlista (valfritt)</h3>
              <p className="text-sm text-gray-600">Ladda upp restaurangens vinlista</p>
            </div>
          </div>

          {!wineListFile ? (
            <label className="block">
              <input
                type="file"
                accept="image/*,.pdf,.txt"
                onChange={handleWineListFileChange}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Klicka för att ladda upp vinlista</p>
                <p className="text-sm text-gray-500 mt-1">Om tom används din samling</p>
              </div>
            </label>
          ) : (
            <div className="space-y-3">
              {wineListPreview ? (
                <img
                  src={wineListPreview}
                  alt="Wine list preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="bg-gray-100 rounded-lg p-4 flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{wineListFile.name}</p>
                    <p className="text-sm text-gray-500">{(wineListFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => {
                  setWineListFile(null)
                  setWineListPreview(null)
                }}
                className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Ta bort</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={analyzeWithAI}
          disabled={!menuFile || analyzing}
          className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5" />
          <span>{analyzing ? 'Analyserar...' : 'Analysera med AI'}</span>
        </button>
        {(menuFile || wineListFile) && (
          <button
            onClick={clearFiles}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Rensa</span>
          </button>
        )}
      </div>

      {/* Results */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span>AI-rekommendationer</span>
          </h3>

          <div className="space-y-4">
            {matches.map((match, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{match.dish}</h4>
                  {match.description && (
                    <p className="text-gray-600 mt-1">{match.description}</p>
                  )}
                </div>

                <div className="space-y-3">
                  {match.recommendedWines.map((wine, wineIndex) => (
                    <div
                      key={wineIndex}
                      className="border-l-4 border-purple-500 bg-purple-50 rounded-r-lg p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-semibold text-gray-900 flex items-center space-x-2">
                            <Wine className="w-5 h-5 text-purple-600" />
                            <span>{wine.name}</span>
                          </h5>
                          {wine.producer && (
                            <p className="text-sm text-gray-600 ml-7">{wine.producer}</p>
                          )}
                          <p className="text-sm text-purple-600 ml-7">{wine.type}</p>
                        </div>
                        <div className="flex items-center space-x-1 bg-purple-100 px-3 py-1 rounded-full">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-semibold text-purple-700">
                            {wine.confidence}%
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-7">{wine.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      {matches.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">Hur det fungerar</h4>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Ladda upp en bild, PDF eller text av restaurangmenyn</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Valfritt: Ladda upp restaurangens vinlista (annars används viner från din samling)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>AI:n analyserar rätterna och föreslår matchande viner med motiveringar</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Få detaljerade rekommendationer för varje rätt på menyn</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
