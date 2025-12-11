# AI Menu Matcher - API Setup

## Konfiguration

För att aktivera AI-meny-matchning funktionen behöver du konfigurera en OpenAI API-nyckel i Vercel.

### Steg 1: Skaffa en OpenAI API-nyckel

1. Gå till https://platform.openai.com/
2. Skapa ett konto eller logga in
3. Navigera till "API Keys" (https://platform.openai.com/api-keys)
4. Klicka "Create new secret key"
5. Ge nyckeln ett namn (t.ex. "Wine App")
6. Kopiera nyckeln (den börjar med `sk-...`)

### Steg 2: Konfigurera i Vercel

1. Gå till ditt projekt på https://vercel.com/dashboard
2. Välj ditt projekt
3. Gå till "Settings" > "Environment Variables"
4. Lägg till en ny variabel:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Din API-nyckel från steg 1
   - **Environment:** Production (och Preview om du vill)
5. Klicka "Save"
6. Deploya om projektet (eller nästa deploy kommer automatiskt använda nyckeln)

### Steg 3: Testa funktionen

1. Gå till "Meny"-fliken i appen
2. Ladda upp en meny (bild, PDF eller text)
3. Valfritt: Ladda upp en vinlista
4. Klicka "Analysera med AI"
5. AI:n kommer analysera menyn och föreslå vinmatchningar!

## API-endpoint

Endpointen finns på `/api/match-menu` och tar emot:

```typescript
{
  menuFile: {
    content: string,  // base64-encoded file
    type: string,     // MIME type
    name: string      // filename
  },
  wineListFile?: {   // Optional
    content: string,
    type: string,
    name: string
  },
  availableWines: Array<{
    id: string,
    name: string,
    producer?: string,
    type: string,
    grape?: string,
    region?: string,
    country?: string
  }>
}
```

Response:

```typescript
{
  "matches": [
    {
      "dish": "Dish name",
      "description": "Brief description if available",
      "recommendedWines": [
        {
          "id": "wine-id-from-available-list",
          "name": "Wine name",
          "producer": "Producer name",
          "type": "Wine type",
          "reason": "Detailed explanation of why this pairs well",
          "confidence": 95  // 0-100
        }
      ]
    }
  ]
}
```

## Kostnader

OpenAI GPT-4o kostar:
- Input: $2.50 per 1M tokens
- Output: $10.00 per 1M tokens
- Vision: Bildstorlek påverkar kostnad (typiskt 85-170 tokens per bild)

En typisk meny-analys med en bild:
- Input: ~500-1500 tokens (text + bild)
- Output: ~500-1000 tokens
- Kostnad per analys: ~$0.01-0.03

## AI-modell

Använder **GPT-4o** (GPT-4 Turbo with vision):
- Stöd för bildanalys
- Hög precision i textigenkänning
- Bra på att förstå menystrukturer
- Kan analysera både text och bilder samtidigt

## Alternativ

Om du inte vill använda OpenAI API kan du:
1. Använda demo-data (visas automatiskt om API:t inte är konfigurerat)
2. Implementera din egen AI-integration (Anthropic Claude, Google Gemini, etc.)
3. Bygga en lokal LLM-lösning med Ollama eller liknande
