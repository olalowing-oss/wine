# Fixa "Failed to fetch" - Steg för steg

## Problemet
Du får felet "TypeError: Failed to fetch" när du försöker använda appen. Detta beror troligen på att SQL-migreringarna inte är körda i Supabase.

## Lösning - Kör SQL-migreringar i Supabase

### Steg 1: Logga in på Supabase Dashboard
1. Gå till https://supabase.com/dashboard
2. Välj ditt projekt: `vcawwvjfwaptojrswljn`

### Steg 2: Öppna SQL Editor
1. Klicka på "SQL Editor" i vänstermenyn
2. Klicka på "+ New query"

### Steg 3: Kör migreringarna i följande ordning

#### 1. Grundläggande schema (OBLIGATORISK)
Kör innehållet från: `001_initial_schema.sql`

Detta skapar:
- ✅ wines-tabellen
- ✅ menu_pairings-tabellen
- ✅ Storage bucket för bilder
- ✅ RLS-policies

#### 2. Inaktivera RLS (REKOMMENDERAT för utveckling)
Kör innehållet från: `002_disable_rls.sql`

Detta inaktiverar Row Level Security så du kan testa utan att logga in först.

**VARNING**: Detta bör INTE göras i produktion!

#### 3. Lägg till land/region-fält
Kör innehållet från: `004_add_country_region_fields.sql`

#### 4. Skapa grapes-tabellen
Kör innehållet från: `supabase/migrations/005_create_grapes_table.sql`

#### 5. Fyll grapes-data
Kör ANTINGEN:
- `supabase/migrations/006_seed_grapes_data.sql` (kort version), ELLER
- `supabase/migrations/006_seed_grapes_data_complete.sql` (komplett version)

#### 6. Skapa regions-tabellen
Kör innehållet från: `supabase/migrations/007_create_regions_table.sql`

#### 7. Fyll regions-data
Kör båda:
- `supabase/migrations/008_seed_regions_data.sql`
- `supabase/migrations/009_seed_regions_data_part2.sql`

#### 8. Optimeringar (VALFRITT men rekommenderat)
Kör:
- `009_enable_search_extensions.sql`
- `010_optimize_database_indexes.sql`

## Snabbversion - Minimalt som krävs

Om du bara vill få igång appen snabbt, kör dessa i ordning:

1. `001_initial_schema.sql` - Skapar grundläggande tabeller
2. `002_disable_rls.sql` - Inaktiverar RLS för utveckling

Detta bör vara nog för att få igång appen!

## Verifiera att det fungerar

### Metod 1: Via Supabase Dashboard
1. Gå till "Table Editor" i Supabase Dashboard
2. Kontrollera att du ser följande tabeller:
   - ✅ wines
   - ✅ menu_pairings
   - ✅ grapes (om du körde migration 5)
   - ✅ regions (om du körde migration 7)

### Metod 2: Via appen
1. Starta appen: `npm run dev`
2. Öppna http://localhost:5173
3. Om du ser vinlistan (även om den är tom) fungerar det!

## Vanliga problem

### Problem: "Table doesn't exist"
**Lösning**: Du har inte kört `001_initial_schema.sql`. Kör den nu.

### Problem: "Permission denied" eller "new row violates row-level security policy"
**Lösning**: Antingen:
- Kör `002_disable_rls.sql` för att inaktivera RLS, ELLER
- Logga in via appen först (använd Auth.tsx-komponenten)

### Problem: "Failed to fetch" fortfarande
**Lösning**:
1. Kontrollera att din `.env` fil har rätt värden:
   ```
   VITE_SUPABASE_URL=https://vcawwvjfwaptojrswljn.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
2. Starta om dev-servern: `npm run dev`
3. Rensa webbläsarens cache (Cmd+Shift+R på Mac, Ctrl+Shift+R på Windows)

## Nästa steg efter fix

Efter att du fått igång appen:
1. Testa att lägga till ett vin
2. Testa att söka efter viner
3. Om du vill ha produktionssäkerhet, aktivera RLS igen och sätt upp autentisering
