# AI Menu Matcher - API Setup

## Konfiguration

För att aktivera AI-meny-matchning funktionen behöver du konfigurera en Anthropic API-nyckel i Vercel.

### Steg 1: Skaffa en Anthropic API-nyckel

1. Gå till https://console.anthropic.com/
2. Skapa ett konto eller logga in
3. Navigera till "API Keys"
4. Skapa en ny API-nyckel
5. Kopiera nyckeln (den börjar med `sk-ant-...`)

### Steg 2: Konfigurera i Vercel

1. Gå till ditt projekt på https://vercel.com/dashboard
2. Välj ditt projekt
3. Gå till "Settings" > "Environment Variables"
4. Lägg till en ny variabel:
   - **Name:** `ANTHROPIC_API_KEY`
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
  matches: Array<{
    dish: string,
    description?: string,
    recommendedWines: Array<{
      id: string,
      name: string,
      producer?: string,
      type: string,
      reason: string,
      confidence: number  // 0-100
    }>
  }>
}
```

## Kostnader

Anthropic Claude API kostar ungefär:
- Claude 3.5 Sonnet: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- En typisk meny-analys använder cirka 1000-3000 tokens
- Kostnad per analys: ~$0.01-0.05

## Alternativ

Om du inte vill använda Anthropic API kan du:
1. Använda demo-data (visas automatiskt om API:t inte är konfigurerat)
2. Implementera din egen AI-integration (OpenAI, Google, etc.)
3. Bygga en lokal LLM-lösning
