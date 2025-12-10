/**
 * One-time migration script to move hardcoded grapes to database
 * Run this once to populate the grapes table
 */

import { supabase } from './supabase'

const hardcodedGrapes = [
  // This will contain all 50 grapes from the current GrapeGuide.tsx
  // For now, showing structure with first few grapes
  {
    id: 'cabernet-sauvignon',
    name: 'Cabernet Sauvignon',
    alternative_names: null,
    color: 'red' as const,
    style: 'Fyllig till mycket fyllig, hög tannin, medel till hög syra och ofta relativt hög alkohol. Stram i ung ålder, med tydlig struktur och ibland kantiga tanniner som behöver tid eller mat.',
    aromas: 'Svarta vinbär, cassis, plommon, körsbär, ceder, grafit, tobak, paprika (grön capsicum) i svalare klimat; med mognad kommer läder, cigarrlåda och torkade örter.',
    origin: 'Ursprung i Bordeaux (framför allt Médoc), idag globalt spridd: Napa Valley, Chile (Maipo, Colchagua), Australien (Coonawarra, Margaret River), Sydafrika, Italien, Spanien m.fl.',
    styles: 'Ofta ryggrad i klassiska Bordeauxblandningar; görs både som druvrent vin och i cuvéer med Merlot, Cabernet Franc m.fl. Vanligt med ekfatslagring.',
    aging: 'Mycket god. Kvalitetsviner från klassiska områden kan utvecklas i 10–30 år, ibland längre. Enklare stilar är mer tänkta att drickas inom 3–8 år.',
    food_pairing: 'Perfekt till grillat och stekt nötkött, biff, entrecôte, lamm, vilt, mustiga grytor och lagrade, hårda ostar. De kraftigare, fatlagrade vinerna trivs med fetare tillbehör.',
    display_order: 0
  },
  // ... add all other grapes here
]

export async function migrateGrapesToDatabase() {
  console.log('Starting grape migration...')

  for (let i = 0; i < hardcodedGrapes.length; i++) {
    const grape = { ...hardcodedGrapes[i], display_order: i }

    const { error } = await supabase
      .from('grapes')
      .upsert(grape, { onConflict: 'id' })

    if (error) {
      console.error(`Error migrating ${grape.name}:`, error)
    } else {
      console.log(`✓ Migrated ${grape.name}`)
    }
  }

  console.log('Migration complete!')
}

// Uncomment to run migration
// migrateGrapesToDatabase()
