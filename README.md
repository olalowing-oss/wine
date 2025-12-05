# Min Vinsamling - React Wine Collection App

En modern vinsamlingsapp med AI-funktioner, byggd med React, Supabase och OpenAI.

## Funktioner

- 🍷 **Vinsamling**: Hantera din personliga vinsamling
- 📸 **AI-bildanalys**: Lägg till viner genom att fotografera etiketten
- ✍️ **AI-textanalys**: Beskriv ett vin och få AI att fylla i informationen
- 🏠 **Hemma-vy**: Håll koll på vilka viner du har hemma
- 🤖 **AI-rekommendationer**: Få personliga vinrekommendationer
- 🍽️ **Menyanalys**: Analysera restaurangmenyer och få vinförslag
- 💾 **Backup**: Exportera din data till JSON/CSV

## Teknisk Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: OpenAI GPT-4o
- **Deployment**: Vercel

## Installation

### 1. Klona projektet

```bash
cd wine-app
```

### 2. Installera dependencies

```bash
npm install
```

### 3. Sätt upp Supabase

1. Gå till [supabase.com](https://supabase.com) och skapa ett nytt projekt
2. I Supabase Dashboard, gå till SQL Editor
3. Kör SQL-filen: `supabase/migrations/001_initial_schema.sql`
4. Gå till Settings > API och kopiera:
   - Project URL
   - Anon/Public key

### 4. Konfigurera environment variables

Kopiera `.env.example` till `.env`:

```bash
cp .env.example .env
```

Fyll i dina nycklar:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_OPENAI_API_KEY=sk-your-openai-key-here
```

### 5. Starta utvecklingsservern

```bash
npm run dev
```

Appen körs nu på `http://localhost:3000`

## Deployment till Vercel

### 1. Installera Vercel CLI

```bash
npm install -g vercel
```

### 2. Logga in på Vercel

```bash
vercel login
```

### 3. Deploya projektet

```bash
vercel
```

### 4. Lägg till environment variables i Vercel

Gå till ditt projekt på Vercel Dashboard och lägg till:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`

### 5. Deploya till produktion

```bash
vercel --prod
```

## Projektstruktur

```
wine-app/
├── src/
│   ├── components/      # React-komponenter
│   │   ├── Auth.tsx
│   │   ├── Layout.tsx
│   │   ├── WineList.tsx
│   │   ├── WineDetail.tsx
│   │   └── AddWine.tsx
│   ├── hooks/          # Custom hooks
│   │   └── useApi.ts
│   ├── lib/            # Bibliotek och konfiguration
│   │   └── supabase.ts
│   ├── services/       # API-tjänster
│   │   └── openai.service.ts
│   ├── store/          # State management
│   │   └── index.ts
│   ├── types/          # TypeScript-typer
│   │   ├── database.types.ts
│   │   └── wine.types.ts
│   ├── utils/          # Utility-funktioner
│   │   └── wine.utils.ts
│   ├── App.tsx         # Huvudkomponent
│   ├── main.tsx        # Entry point
│   └── index.css       # Global CSS
├── supabase/
│   └── migrations/     # Databas-migrations
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Användning

### Lägga till viner

1. **Från bild**: Ta en bild av vinetiketten och låt AI analysera den
2. **Från text**: Beskriv vinet och AI fyller i informationen

### Hantera viner

- Klicka på ett vin för att se detaljer
- Markera viner som "Hemma" för att hålla koll på lagret
- Lägg till taggar för enkel kategorisering
- Sätt betyg och pris

### AI-rekommendationer

Klicka på "Generera rekommendationer" i vindetaljer för att få personliga förslag baserade på dina preferenser.

## API-nycklar

### OpenAI API

1. Gå till [platform.openai.com](https://platform.openai.com)
2. Skapa ett konto och lägg till betalningsmetod
3. Gå till API Keys och skapa en ny nyckel
4. Lägg till nyckeln i `.env` som `VITE_OPENAI_API_KEY`

### Supabase

1. Skapa ett gratis konto på [supabase.com](https://supabase.com)
2. Skapa ett nytt projekt
3. Kopiera Project URL och Anon key från Settings > API

## Säkerhet

- API-nycklar exponeras ALDRIG i klienten (använd environment variables)
- Supabase Row Level Security (RLS) skyddar användardata
- Alla bilder lagras säkert i Supabase Storage
- Autentisering hanteras av Supabase Auth

## Utveckling

### Bygga för produktion

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Licens

MIT

## Support

För frågor eller problem, skapa ett issue på GitHub.
