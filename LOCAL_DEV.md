# Lokal Utveckling med API

## Problem
Vercel API-routes (`/api/*`) fungerar inte med vanlig Vite dev-server (`npm run dev`). Du kommer att se demo-data istället för riktiga AI-analyser.

## Lösningar

### Alternativ 1: Testa på Vercel (Rekommenderat)

Deploy till Vercel och testa där:

```bash
git push
# Vänta på deploy, testa på https://[ditt-projekt].vercel.app
```

### Alternativ 2: Använd Vercel CLI för lokal utveckling

1. **Installera Vercel CLI**
```bash
npm install -g vercel
```

2. **Logga in**
```bash
vercel login
```

3. **Länka projektet**
```bash
vercel link
```

4. **Hämta environment variables från Vercel**
```bash
vercel env pull .env.local
```

Detta skapar en `.env.local` fil med dina API-nycklar.

5. **Starta utvecklingsservern med Vercel**
```bash
vercel dev
```

Detta startar både frontend OCH API-routes lokalt på http://localhost:3000

Nu fungerar `/api/match-menu` och du kan testa AI-funktionen!

### Alternativ 3: Demo-data (Standard)

Om du kör `npm run dev` utan Vercel CLI kommer demo-data att visas automatiskt. Detta är bra för att testa UI:t utan att behöva AI-API.

## Environment Variables för Lokal Utveckling

Om du använder Vercel CLI, skapa `.env.local`:

```env
OPENAI_API_KEY=sk-...your-key-here...
```

**OBS:** Lägg INTE till `.env.local` i git! Den är redan i `.gitignore`.

## Felsökning

### "Kunde inte analysera menyn"
- **På lokal dev (`npm run dev`):** Detta är förväntat. API-routes fungerar inte. Demo-data visas.
- **På Vercel dev (`vercel dev`):** Kontrollera att `.env.local` innehåller `OPENAI_API_KEY`
- **På Vercel produktion:** Kontrollera Environment Variables i Vercel Dashboard

### API-anrop når inte servern
- Lokal dev: Normalt - använd `vercel dev` eller deploya till Vercel
- Vercel dev: Kolla att port 3000 inte är upptagen
- Produktion: Kolla Vercel Function Logs i Dashboard

## Rekommenderad Workflow

**För UI-utveckling:**
```bash
npm run dev
# Snabbt, hot reload, men demo-data för AI
```

**För API-testning:**
```bash
vercel dev
# Långsammare, men API fungerar lokalt
```

**För slutgiltig testning:**
```bash
git push
# Testa på riktiga Vercel-miljön
```
