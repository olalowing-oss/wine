import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vcawwvjfwaptojrswljn.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYXd3dmpmd2FwdG9qcnN3bGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NjE2MzIsImV4cCI6MjA4MDIzNzYzMn0.WptibFKGg8TFh9ENqPA9tVmO7_hjwUtzYOMkp3-5yOY'

console.log('🔍 Testar Supabase-anslutning...')
console.log('URL:', supabaseUrl)
console.log('Anon Key (första 20 tecken):', supabaseAnonKey.substring(0, 20) + '...')

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('\n✅ Testar grundläggande anslutning...')

    // Test 1: Kolla om wines-tabellen finns
    console.log('\n📊 Test 1: Kontrollerar wines-tabellen...')
    const { data: winesData, error: winesError } = await supabase
      .from('wines')
      .select('count')
      .limit(1)

    if (winesError) {
      console.error('❌ Fel vid hämtning från wines-tabellen:', winesError)
      console.log('   Detta kan betyda att tabellen inte finns eller att RLS blockerar åtkomst')
    } else {
      console.log('✅ wines-tabellen är tillgänglig')
    }

    // Test 2: Kolla om grapes-tabellen finns
    console.log('\n📊 Test 2: Kontrollerar grapes-tabellen...')
    const { data: grapesData, error: grapesError } = await supabase
      .from('grapes')
      .select('count')
      .limit(1)

    if (grapesError) {
      console.error('❌ Fel vid hämtning från grapes-tabellen:', grapesError)
    } else {
      console.log('✅ grapes-tabellen är tillgänglig')
    }

    // Test 3: Kolla om regions-tabellen finns
    console.log('\n📊 Test 3: Kontrollerar regions-tabellen...')
    const { data: regionsData, error: regionsError } = await supabase
      .from('regions')
      .select('count')
      .limit(1)

    if (regionsError) {
      console.error('❌ Fel vid hämtning från regions-tabellen:', regionsError)
    } else {
      console.log('✅ regions-tabellen är tillgänglig')
    }

    // Test 4: Kolla om menu_pairings-tabellen finns
    console.log('\n📊 Test 4: Kontrollerar menu_pairings-tabellen...')
    const { data: menuData, error: menuError } = await supabase
      .from('menu_pairings')
      .select('count')
      .limit(1)

    if (menuError) {
      console.error('❌ Fel vid hämtning från menu_pairings-tabellen:', menuError)
    } else {
      console.log('✅ menu_pairings-tabellen är tillgänglig')
    }

    // Test 5: Kontrollera autentisering
    console.log('\n🔐 Test 5: Kontrollerar autentiseringsstatus...')
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      console.log('✅ Användare är inloggad:', session.user.email)
    } else {
      console.log('⚠️  Ingen användare är inloggad (detta kan vara orsaken till "Failed to fetch")')
      console.log('   Om RLS är aktiverat måste du vara inloggad för att hämta data')
    }

    console.log('\n' + '='.repeat(60))
    console.log('SAMMANFATTNING:')
    console.log('='.repeat(60))

    if (winesError && winesError.code === 'PGRST116') {
      console.log('❌ PROBLEM: Tabeller saknas i databasen')
      console.log('   LÖSNING: Kör följande SQL-filer i Supabase SQL Editor:')
      console.log('   1. 001_initial_schema.sql')
      console.log('   2. 002_disable_rls.sql (om du vill inaktivera RLS)')
      console.log('   3. 004_add_country_region_fields.sql')
      console.log('   4. supabase/migrations/005_create_grapes_table.sql')
      console.log('   5. supabase/migrations/007_create_regions_table.sql')
    } else if (winesError && winesError.code === '42501') {
      console.log('❌ PROBLEM: RLS (Row Level Security) blockerar åtkomst')
      console.log('   LÖSNING 1: Logga in först med Auth.tsx')
      console.log('   LÖSNING 2: Kör 002_disable_rls.sql för att inaktivera RLS')
    } else if (!session) {
      console.log('⚠️  VARNING: Du är inte inloggad')
      console.log('   Om RLS är aktiverat behöver du logga in först')
    } else {
      console.log('✅ Alla tester passerade!')
    }

  } catch (err) {
    console.error('\n❌ KRITISKT FEL:', err)
    console.log('\nDetta kan bero på:')
    console.log('1. Felaktig Supabase URL eller API-nyckel')
    console.log('2. Nätverksproblem')
    console.log('3. CORS-problem (om du kör från fel domän)')
  }
}

testConnection()
