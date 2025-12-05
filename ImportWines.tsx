import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { supabase } from './supabase'
import { toast } from 'react-hot-toast'
import type { Wine } from './wine.types'

interface ImportStats {
  total: number
  successful: number
  failed: number
  errors: string[]
}

export function ImportWines() {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [stats, setStats] = useState<ImportStats | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setStats(null)
    } else {
      toast.error('Vänligen välj en CSV-fil')
    }
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"'
          i++
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }

  const parseCSV = (text: string): any[] => {
    // Split into lines but handle quoted fields with newlines
    const lines: string[] = []
    let currentLine = ''
    let inQuotes = false

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const nextChar = text[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentLine += '""'
          i++
        } else {
          inQuotes = !inQuotes
          currentLine += char
        }
      } else if (char === '\n' && !inQuotes) {
        if (currentLine.trim()) {
          lines.push(currentLine)
        }
        currentLine = ''
      } else if (char === '\r') {
        // Skip carriage returns
        continue
      } else {
        currentLine += char
      }
    }

    // Add last line
    if (currentLine.trim()) {
      lines.push(currentLine)
    }

    if (lines.length < 2) return []

    const headers = parseCSVLine(lines[0])
    const wines: any[] = []

    // Debug: Log headers
    console.log('CSV Headers:', headers)
    console.log('Total lines after proper parsing:', lines.length)

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const wine: any = {}

      // Debug: Log first row
      if (i === 1) {
        console.log('First row values:', values)
        console.log('Number of values:', values.length)
        console.log('Number of headers:', headers.length)
      }

      headers.forEach((header, index) => {
        let value = values[index]?.trim() || ''

        // Remove surrounding quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1)
        }

        // Debug: Log mapping for first row
        if (i === 1) {
          console.log(`Mapping "${header}" to value "${value}"`)
        }

        // Map CSV headers to database columns - use exact match
        switch (header) {
          case 'Vinnamn':
            wine.vin_namn = value
            break
          case 'Typ':
            wine.typ = value
            break
          case 'Ursprung':
            wine.ursprung = value
            break
          case 'Producent':
            wine.producent = value
            break
          case 'Druva':
            wine.druva = value
            break
          case 'Plats':
            wine.plats = value
            break
          case 'Latitude':
            wine.latitude = value ? parseFloat(value) : null
            break
          case 'Longitude':
            wine.longitude = value ? parseFloat(value) : null
            break
          case 'Betyg':
            wine.betyg = value ? parseFloat(value) : null
            break
          case 'Pris':
            wine.pris = value ? parseFloat(value) : null
            break
          case 'Systembolaget Länk':
            wine.systembolaget_lank = value
            break
          case 'Datum Tillagd':
            wine.datum_tillagd = value || new Date().toISOString()
            break
          case 'Taggar':
            wine.taggar = value
            break
          case 'Hemma':
            wine.ar_hemma = value.toLowerCase() === 'ja' || value.toLowerCase() === 'yes'
            break
          case 'Beskrivning':
            wine.beskrivning = value
            break
          case 'Smakanteckningar':
            wine.smakanteckningar = value
            break
          case 'Serveringsinformation':
            wine.servering_info = value
            break
          case 'Övrigt':
            wine.ovrigt = value
            break
        }
      })

      // Add week number (current week as default)
      const now = new Date()
      const startOfYear = new Date(now.getFullYear(), 0, 1)
      const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
      wine.vecka = weekNumber

      // Only add wine if it has required fields and is not empty
      if (wine.vin_namn && wine.vin_namn.length > 0 && wine.typ && wine.typ.length > 0) {
        wines.push(wine)
        console.log(`Added wine ${wines.length}:`, wine.vin_namn)
      } else {
        console.log(`Skipped row ${i}: missing vin_namn or typ`)
      }
    }

    return wines
  }

  const handleImport = async () => {
    if (!file) {
      toast.error('Ingen fil vald')
      return
    }

    setImporting(true)
    const importStats: ImportStats = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: []
    }

    try {
      const text = await file.text()
      const wines = parseCSV(text)
      importStats.total = wines.length

      if (wines.length === 0) {
        toast.error('Inga viner hittades i filen')
        setImporting(false)
        return
      }

      // Import wines one by one to catch individual errors
      for (const wine of wines) {
        try {
          const { error } = await supabase
            .from('wines')
            .insert([wine])

          if (error) {
            importStats.failed++
            importStats.errors.push(`${wine.vin_namn}: ${error.message}`)
          } else {
            importStats.successful++
          }
        } catch (err) {
          importStats.failed++
          importStats.errors.push(`${wine.vin_namn}: ${(err as Error).message}`)
        }
      }

      setStats(importStats)

      if (importStats.successful > 0) {
        toast.success(`${importStats.successful} viner importerade!`)
      }
      if (importStats.failed > 0) {
        toast.error(`${importStats.failed} viner misslyckades`)
      }

    } catch (error) {
      toast.error('Kunde inte läsa filen: ' + (error as Error).message)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Importera Viner</h2>
          <p className="text-gray-600 mt-1">Importera viner från en CSV-fil</p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-purple-600" />
            </div>

            <div>
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-purple-600 hover:text-purple-700 font-medium">
                  Välj en CSV-fil
                </span>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={importing}
                />
              </label>
              <p className="text-sm text-gray-500 mt-1">
                eller dra och släpp filen här
              </p>
            </div>

            {file && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded">
                <FileText className="w-4 h-4" />
                <span>{file.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Import Button */}
        {file && !stats && (
          <button
            onClick={handleImport}
            disabled={importing}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Importerar...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Importera Viner</span>
              </>
            )}
          </button>
        )}

        {/* Import Stats */}
        {stats && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
                <div className="text-sm text-blue-600">Totalt</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-900">{stats.successful}</div>
                <div className="text-sm text-green-600">Lyckades</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-900">{stats.failed}</div>
                <div className="text-sm text-red-600">Misslyckades</div>
              </div>
            </div>

            {stats.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900 mb-2">Fel vid import:</h4>
                    <ul className="text-sm text-red-700 space-y-1 max-h-60 overflow-y-auto">
                      {stats.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/wines')}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Visa Viner
              </button>
              <button
                onClick={() => {
                  setFile(null)
                  setStats(null)
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Importera Fler
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-medium text-gray-900 mb-3">CSV-format:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Första raden ska innehålla kolumnnamn</li>
            <li>• Obligatoriska fält: Vinnamn, Typ</li>
            <li>• Valfria fält: Producent, Ursprung, Druva, Pris, Betyg, Plats, Beskrivning, m.m.</li>
            <li>• Hemma-fältet: "Ja" eller "Nej"</li>
            <li>• Datum i format: YYYY-MM-DD HH:MM:SS</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
