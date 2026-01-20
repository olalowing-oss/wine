# Guide: Var sparas menybilderna?

## Bildlagring i Supabase Storage

Menybilderna sparas i **Supabase Storage** i en bucket kallad `menu-images`.

### Struktur:
```
menu-images/
  └── public/
      └── [pairing-id]/
          └── [timestamp].jpg/png/etc
```

### Exempel:
Om en menyanalys har ID `abc123`, sparas bilden som:
```
menu-images/public/abc123/1704067200000.jpg
```

## Steg för att aktivera bildlagring

### 1. Kör SQL-migrationen i Supabase

Du måste köra SQL-migrationen för att skapa storage-bucketen och sätta up policies:

1. Gå till [Supabase Dashboard](https://app.supabase.com)
2. Välj ditt projekt (`vcawwvjfwaptojrswljn`)
3. Gå till **SQL Editor** i vänstermenyn
4. Klistra in innehållet från `012_create_menu_images_bucket.sql`
5. Klicka **Run**

### 2. Verifiera att bucketen skapades

1. Gå till **Storage** i Supabase Dashboard
2. Du ska se en bucket som heter `menu-images`
3. Den ska vara markerad som "Public" (alla kan se bilder)

## Hur det fungerar

### När du sparar en ny menyanalys:
1. Komponenten skapar först en `menu_pairing` i databasen (får ett ID)
2. Om du har laddat upp en menybild, laddas den upp till Supabase Storage med ID:t
3. Bildens URL sparas sedan i `menu_image_url`-kolumnen

### När du redigerar en befintlig menyanalys:
1. Om du laddar upp en ny bild, ersätts den gamla bilden
2. Den nya bildens URL uppdateras i databasen

### Bildvisning:
- I **Sparade menyer** visas en thumbnail (80x80px) av menybilden
- Bilden är klickbar och expanderar analysen
- Bilderna är publikt tillgängliga via URL:en (behövs ingen autentisering för att se dem)

## API-funktioner

### `uploadMenuImage(file, pairingId)`
Laddar upp en bild till Supabase Storage.

**Parametrar:**
- `file`: File-objekt från input
- `pairingId`: ID för menyanalysen

**Returnerar:**
- Public URL till den uppladdade bilden

### `deleteMenuImage(imageUrl)`
Raderar en bild från Supabase Storage.

**Parametrar:**
- `imageUrl`: URL till bilden som ska raderas

## Felsökning

### Problem: "Bucket does not exist"
**Lösning:** Kör SQL-migrationen `012_create_menu_images_bucket.sql`

### Problem: "Permission denied"
**Lösning:** Kontrollera att storage policies är korrekt uppsatta (se SQL-migrationen)

### Problem: Bilden visas inte
**Lösning:**
1. Kontrollera att bucketen är markerad som "Public" i Supabase Dashboard
2. Verifiera att bildens URL är korrekt sparad i databasen
3. Testa att öppna bildens URL direkt i webbläsaren

## Fördelar med Supabase Storage

✅ **Automatisk CDN** - Bilder serveras snabbt från CDN
✅ **Skalbar** - Hanterar stora mängder bilder
✅ **Säker** - Fine-grained access policies
✅ **Kostnadseffektiv** - Generös free tier
✅ **Enkel integration** - Fungerar sömlöst med Supabase databas
