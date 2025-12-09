import type { Wine, WineInfo } from './wine.types'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_BASE_URL = 'https://api.openai.com/v1/chat/completions'

interface OpenAIMessage {
  role: 'user' | 'system' | 'assistant'
  content: Array<{ type: string; text?: string; image_url?: { url: string } }>
}

interface OpenAIRequest {
  model: string
  messages: OpenAIMessage[]
  max_tokens: number
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export class OpenAIService {
  private async makeRequest(messages: OpenAIMessage[]): Promise<string> {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API-nyckel saknas. Lägg till VITE_OPENAI_API_KEY i .env')
    }

    const response = await fetch(OPENAI_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 1500,
      } as OpenAIRequest),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API fel: ${error}`)
    }

    const data = await response.json() as OpenAIResponse
    return data.choices[0]?.message?.content || ''
  }

  async analyzeWineLabel(imageBase64: string): Promise<WineInfo> {
    const prompt = this.createWineLabelAnalysisPrompt()
    
    const messages: OpenAIMessage[] = [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ],
      },
    ]

    const response = await this.makeRequest(messages)
    return this.parseWineInfo(response)
  }

  async analyzeWineFromText(description: string): Promise<WineInfo> {
    const prompt = this.createTextAnalysisPrompt(description)
    
    const messages: OpenAIMessage[] = [
      {
        role: 'user',
        content: [{ type: 'text', text: prompt }],
      },
    ]

    const response = await this.makeRequest(messages)
    return this.parseWineInfo(response)
  }

  async generateWineRecommendations(wine: Wine, existingWines: Wine[]): Promise<string> {
    const prompt = this.createRecommendationPrompt(wine, existingWines)
    
    const messages: OpenAIMessage[] = [
      {
        role: 'user',
        content: [{ type: 'text', text: prompt }],
      },
    ]

    return await this.makeRequest(messages)
  }

  async analyzeMenu(menuText: string, menuImageBase64?: string): Promise<any> {
    let content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      {
        type: 'text',
        text: `Analysera denna restaurangmeny och föreslå passande viner från Systembolaget för varje rätt. 
        Ge konkreta förslag med vinnamn, producent och ungefärligt pris.
        
        ${menuText}`,
      },
    ]

    if (menuImageBase64) {
      content.push({
        type: 'image_url',
        image_url: { url: `data:image/jpeg;base64,${menuImageBase64}` },
      })
    }

    const messages: OpenAIMessage[] = [
      { role: 'user', content },
    ]

    const response = await this.makeRequest(messages)
    return { analysis: response }
  }

  private createWineLabelAnalysisPrompt(): string {
    return `Du agerar som expert-sommelier. Din uppgift är att analysera bilden av vinetiketten noggrant och returnera enbart giltig JSON enligt strukturen nedan. 

REGLER:
1) Faktafält (name, producer, vintage, alcoholContent, country, region, grapes): Ange endast om det är tydligt på etiketten. Om ej synligt: använd null för siffror eller "" för text.
2) Beskrivande fält (category, description, appearance, aromaProfile, tasteProfile, tastingNotes, servingTemperature, servingSuggestions, foodPairing, suggestedVenue): Här ska du skriva fylliga och professionella sommelierbeskrivningar. Använd ett rikt språk, ge nyanser, inkludera typiska druv- och regionsdrag och skriv på samma detaljnivå som Systembolagets eller en vinjournalists beskrivning.
3) Format: Returnera exakt JSON-strukturen nedan, utan extra text eller kommentarer. 
4) Tonalitet: Använd professionellt, beskrivande språk. Fyll på hellre än att skriva kort.

Returnera ENDAST denna JSON-struktur:
{
  "name": "exakt vinnamn från etiketten",
  "type": "vintyp på svenska (Rött/Vitt/Rosé/Mousserande)",
  "country": "ursprungsland",
  "region": "specifik region",
  "grapes": "druvsort(er) som kommaseparerad text",
  "vintage": årgång_som_nummer_om_synlig,
  "alcoholContent": alkoholhalt_som_nummer_om_synlig,
  "producer": "producent/märke från etiketten",
  "category": "vinets kategori och stil",
  "description": "professionell beskrivning av vinet",
  "appearance": "typisk färg och utseende",
  "aromaProfile": "detaljerad doftprofil",
  "tasteProfile": "detaljerad smakprofil",
  "tastingNotes": "professionella smakanteckningar",
  "servingTemperature": "optimal serveringstemperatur",
  "servingSuggestions": "glastyp och serveringsråd",
  "foodPairing": "specifika matmatchningar",
  "suggestedVenue": "förslag på typ av plats där vinet bäst njuts"
}

VIKTIGT: Använd din vinkunskap för att ge FULLSTÄNDIGA beskrivningar även om allt inte syns på etiketten.`
  }

  private createTextAnalysisPrompt(description: string): string {
    return `Du agerar som expert-sommelier. Baserat på följande beskrivning av ett vin, använd din expertkunskap som sommelier för att ge DETALJERAD information i JSON-format.

Användarens beskrivning: "${description}"

REGLER:
1) Faktafält (name, producer, vintage, alcoholContent, country, region, grapes): Ange endast om det framgår av beskrivningen. Om ej specificerat: använd null för siffror eller "" för text.
2) Beskrivande fält (category, description, appearance, aromaProfile, tasteProfile, tastingNotes, servingTemperature, servingSuggestions, foodPairing, suggestedVenue): Här ska du skriva fylliga och professionella sommelierbeskrivningar baserat på din kunskap om denna typ av vin. Använd ett rikt språk, ge nyanser, inkludera typiska druv- och regionsdrag.
3) Format: Returnera exakt JSON-strukturen nedan, utan extra text eller kommentarer.
4) Tonalitet: Använd professionellt, beskrivande språk.

Returnera ENDAST denna JSON-struktur:
{
  "name": "vinnamn från beskrivningen eller bästa gissning",
  "type": "vintyp på svenska (Rött/Vitt/Rosé/Mousserande)",
  "country": "ursprungsland om känt",
  "region": "specifik region om känd",
  "grapes": "druvsort(er) som kommaseparerad text om känd",
  "vintage": årgång_som_nummer_om_känd,
  "alcoholContent": alkoholhalt_som_nummer_om_känd,
  "producer": "producent/märke om känt",
  "category": "vinets kategori och stil",
  "description": "professionell beskrivning av vinet",
  "appearance": "typisk färg och utseende för denna vintyp",
  "aromaProfile": "detaljerad doftprofil",
  "tasteProfile": "detaljerad smakprofil",
  "tastingNotes": "professionella smakanteckningar",
  "servingTemperatur": "optimal serveringstemperatur",
  "servingSuggestions": "glastyp och serveringsråd",
  "foodPairing": "specifika matmatchningar",
  "suggestedVenue": "förslag på typ av plats där vinet bäst njuts"
}

VIKTIGT: Returnera ENDAST giltig JSON, ingen extra text före eller efter.`
  }

  private createRecommendationPrompt(wine: Wine, existingWines: Wine[]): string {
    const wineSummary = existingWines.slice(0, 15).map(w => {
      let summary = `• ${w.vin_namn} (${w.typ})`
      if (w.producent) summary += ` av ${w.producent}`
      if (w.ursprung) summary += ` från ${w.ursprung}`
      if (w.druva) summary += `, druva: ${w.druva}`
      if (w.pris) summary += `, ${Math.round(w.pris)}kr`
      if (w.betyg) summary += `, betyg: ${w.betyg}/5`
      return summary
    }).join('\n')

    return `Som expert sommelier ska du ge 5 specifika vinrekommendationer som liknar detta vin:

**MÅLVIN:**
Namn: ${wine.vin_namn}
Typ: ${wine.typ}
Producent: ${wine.producent || 'Okänd'}
Ursprung: ${wine.ursprung || 'Okänt'}
Druva: ${wine.druva || 'Okänd'}
Pris: ${wine.pris ? `${wine.pris} kr` : 'Okänt'}

**ANVÄNDARENS BEFINTLIGA VINER:**
${wineSummary || 'Inga andra viner i samlingen än'}

**INSTRUKTIONER:**
1. Rekommendera 5 SPECIFIKA, VERKLIGA viner som finns att köpa
2. Fokusera på viner som är tillgängliga på Systembolaget
3. Variera rekommendationerna från "mycket lika" till "intressant kontrast"
4. Undvik viner som redan finns i användarens samling
5. Ge konkreta skillnader och likheter

Använd denna formatering för svaret med svenska text och specifika vinrekommendationer.`
  }

  private parseWineInfo(jsonString: string): WineInfo {
    // Ta bort eventuella markdown code blocks
    const cleaned = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    try {
      const parsed = JSON.parse(cleaned)
      return {
        name: parsed.name || '',
        type: parsed.type || '',
        country: parsed.country || '',
        region: parsed.region || null,
        grapes: parsed.grapes || null,
        vintage: parsed.vintage || null,
        alcoholContent: parsed.alcoholContent || null,
        description: parsed.description || null,
        tastingNotes: parsed.tastingNotes || null,
        servingTemperature: parsed.servingTemperature || null,
        foodPairing: parsed.foodPairing || null,
        producer: parsed.producer || null,
        category: parsed.category || null,
        appearance: parsed.appearance || null,
        aromaProfile: parsed.aromaProfile || null,
        tasteProfile: parsed.tasteProfile || null,
        servingSuggestions: parsed.servingSuggestions || null,
        suggestedVenue: parsed.suggestedVenue || null,
      }
    } catch (error) {
      console.error('Failed to parse wine info:', error)
      throw new Error('Kunde inte tolka AI-svar som JSON')
    }
  }
}

export const openAIService = new OpenAIService()
