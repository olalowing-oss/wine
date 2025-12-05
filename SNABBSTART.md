# Snabbstart - Min Vinsamling

## Steg 1: Installation

```bash
# Installera dependencies
npm install
```

## Steg 2: Supabase Setup

1. Gå till https://supabase.com och skapa ett konto
2. Skapa ett nytt projekt
3. Gå till SQL Editor i Supabase Dashboard
4. Öppna filen `supabase/migrations/001_initial_schema.sql`
5. Kopiera hela innehållet och kör det i SQL Editor
6. Gå till Settings > API och kopiera:
   - Project URL (börjar med https://)
   - Anon/Public key (lång sträng)

## Steg 3: OpenAI API Key

1. Gå till https://platform.openai.com
2. Skapa ett konto (kräver betalningsmetod)
3. Gå till API Keys
4. Skapa en ny nyckel (börjar med sk-)

## Steg 4: Environment Variables

Skapa en `.env` fil i projektets root:

```env
VITE_SUPABASE_URL=din-supabase-url
VITE_SUPABASE_ANON_KEY=din-supabase-anon-key
VITE_OPENAI_API_KEY=din-openai-key
```

## Steg 5: Starta utvecklingsserver

```bash
npm run dev
```

Appen körs nu på http://localhost:3000

## Steg 6: Skapa ett konto

1. Öppna http://localhost:3000 i din webbläsare
2. Klicka på "Skapa konto"
3. Ange e-post och lösenord
4. Kolla din e-post för verifieringslänk
5. Logga in

## Steg 7: Lägg till ditt första vin

1. Klicka på "Lägg till" i vinlistan
2. Välj "Från bild" eller "Från text"
3. Följ instruktionerna

## Vanliga problem

### Problem: "Supabase URL och Anon Key måste sättas i .env"
**Lösning**: Se till att `.env` filen finns och innehåller rätt värden

### Problem: "OpenAI API-nyckel saknas"
**Lösning**: Kontrollera att `VITE_OPENAI_API_KEY` är satt i `.env`

### Problem: Bilder laddas inte upp
**Lösning**: Kontrollera att storage bucket "wine-images" finns i Supabase

### Problem: Kan inte logga in
**Lösning**: Kontrollera att du verifierat din e-post

## Deployment till Vercel

```bash
# Installera Vercel CLI
npm install -g vercel

# Logga in
vercel login

# Deploya
vercel

# Lägg till environment variables i Vercel Dashboard
# Deploya till produktion
vercel --prod
```

## Nästa steg

- Läs igenom README.md för mer information
- Utforska olika funktioner i appen
- Lägg till dina favoritviner!

## Support

För hjälp, se README.md eller skapa ett issue på GitHub.
