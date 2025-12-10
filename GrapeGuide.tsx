import { useState } from 'react'
import { Search, Wine, ChevronDown, ChevronUp } from 'lucide-react'

interface Grape {
  id: string
  name: string
  alternativeNames?: string[]
  color: 'red' | 'white'
  style: string
  aromas: string
  origin: string
  styles: string
  aging: string
  foodPairing: string
}

const grapes: Grape[] = [
  // RÖDA DRUVOR
  {
    id: 'cabernet-sauvignon',
    name: 'Cabernet Sauvignon',
    color: 'red',
    style: 'Fyllig till mycket fyllig, hög tannin, medel till hög syra och ofta relativt hög alkohol. Stram i ung ålder, med tydlig struktur och ibland kantiga tanniner som behöver tid eller mat.',
    aromas: 'Svarta vinbär, cassis, plommon, körsbär, ceder, grafit, tobak, paprika (grön capsicum) i svalare klimat; med mognad kommer läder, cigarrlåda och torkade örter.',
    origin: 'Ursprung i Bordeaux (framför allt Médoc), idag globalt spridd: Napa Valley, Chile (Maipo, Colchagua), Australien (Coonawarra, Margaret River), Sydafrika, Italien, Spanien m.fl.',
    styles: 'Ofta ryggrad i klassiska Bordeauxblandningar; görs både som druvrent vin och i cuvéer med Merlot, Cabernet Franc m.fl. Vanligt med ekfatslagring.',
    aging: 'Mycket god. Kvalitetsviner från klassiska områden kan utvecklas i 10–30 år, ibland längre. Enklare stilar är mer tänkta att drickas inom 3–8 år.',
    foodPairing: 'Perfekt till grillat och stekt nötkött, biff, entrecôte, lamm, vilt, mustiga grytor och lagrade, hårda ostar. De kraftigare, fatlagrade vinerna trivs med fetare tillbehör.'
  },
  {
    id: 'merlot',
    name: 'Merlot',
    color: 'red',
    style: 'Medelfyllig till fyllig, medel syra och mjukare tanniner än Cabernet. Ofta rund, fruktig och lättare att uppskatta i ung ålder.',
    aromas: 'Plommon, körsbär, skogsbär, choklad, lakrits, örter och ibland kaffe och vanilj från fat. I svalare klimat mer röda bär och örtighet, i varmare mer mörk frukt och syltighet.',
    origin: 'Bordeaux (särskilt högra stranden: Pomerol, Saint‑Émilion); idag även i t.ex. Kalifornien, Chile, Italien (särskilt Toscana), Östeuropa.',
    styles: 'Druvrent eller i Bordeauxblends. Merlot används ofta för att mjuka upp stram Cabernet. Stil från fruktdriven och ekad "Nya världen" till mer strukturerat och jordigt "Gamla världen".',
    aging: 'Bra kvalitetsmerlot kan lagras 8–15 år eller mer, särskilt från klassiska appellationer. Enklare viner är bäst inom 3–6 år.',
    foodPairing: 'Flexibel matdruva: lamm, fläsk, kyckling, hamburgare, köttfärsrätter, pasta med tomat eller svamp, medelstarka ostar.'
  },
  {
    id: 'pinot-noir',
    name: 'Pinot Noir',
    color: 'red',
    style: 'Lätt till medelfyllig, hög syra, låga till medel tanniner. Elegant och känslig druva som tydligt speglar terroir.',
    aromas: 'Röda bär – jordgubb, hallon, körsbär – tillsammans med blommighet (viol, ros) och ofta skogsgolv, svamp, undervegetation vid mognad. Kan få inslag av rök, kryddor och vanilj från fat.',
    origin: 'Bourgogne är referensen (Côte d\'Or), men odlas också i t.ex. Oregon, Kalifornien, Nya Zeeland, Tyskland (Spätburgunder) och Chile.',
    styles: 'Främst eleganta, torra röda viner; druvans släktingar används också i Champagne‑blend (Pinot Noir och Pinot Meunier). Känslig i vinifiering – ofta varsam extraktion och relativt lätt ek.',
    aging: 'Toppviner från Bourgogne och andra kvalitetsregioner kan utvecklas i 10–25 år. Enklare stilar är som bäst inom 3–8 år.',
    foodPairing: 'Kombineras gärna med fågel (anka, kyckling), vildfågel, kalv, fläsk, svampbaserade rätter, lax och tonfisk. En favorit till klassisk fransk bistro‑mat.'
  },
  {
    id: 'syrah',
    name: 'Syrah',
    alternativeNames: ['Shiraz'],
    color: 'red',
    style: 'Medel till fyllig, medel syra, medel till hög tannin. Kan upplevas kraftfull men också elegant beroende på ursprung.',
    aromas: 'Mörka bär (björnbär, blåbär), plommon, svartpeppar, lakrits, rökt kött och ibland oliver. I varmare klimat mer syltig frukt och choklad; i svalare mer peppar och florala toner.',
    origin: 'Norra Rhône (Côte‑Rôtie, Hermitage) är klassiskt. I Nya världen ofta kallad Shiraz, särskilt i Australien (Barossa, McLaren Vale), Sydafrika, USA och Chile.',
    styles: 'Allt från strama, svala Syrah till koncentrerade, rika Shiraz. Används druvrent eller i GSM‑blends (Grenache–Syrah–Mourvèdre). Vanlig med ekfatslagring.',
    aging: 'Högklassig Syrah/Shiraz kan lagras 10–20 år eller mer. Enklare, fruktiga viner mår bra att drickas inom 3–7 år.',
    foodPairing: 'Utmärkt till grillat, BBQ, lamm, vilt, kryddiga korvar, mustiga grytor och smakrika ostar. De peppriga, svalare exemplen fungerar fint till pepparstek och rätter med örter.'
  },
  {
    id: 'grenache',
    name: 'Grenache',
    alternativeNames: ['Garnacha'],
    color: 'red',
    style: 'Medelfyllig till fyllig, relativt låg syra och mjuka tanniner, ofta med hög alkohol. Silkig textur när den är välgjord.',
    aromas: 'Jordgubb, hallon, körsbär, torkade örter, apelsinskal, garrigue (medelhavsörtighet) och ibland vitpeppar. Vid högre koncentration – torkad frukt och choklad.',
    origin: 'Ursprunget anses vara Spanien (Garnacha), men är också mycket viktig i södra Rhône (Châteauneuf‑du‑Pape, Côtes‑du‑Rhône), Priorat, Campo de Borja och Languedoc.',
    styles: 'Vanlig i blends (GSM), men även som druvrent vin och i rosé. Tunnskalig, vilket ger lättare färg men hög alkohol och fyllig frukt.',
    aging: 'Bästa exemplen från t.ex. Châteauneuf‑du‑Pape och Priorat kan lagras 10–20 år. Lättare, fruktiga versioner är godast inom 3–6 år.',
    foodPairing: 'Passar fint till lamm, grillat, medelhavskök, grönsaksrätter, ratatouille, tapas och halvhårda ostar.'
  },
  {
    id: 'tempranillo',
    name: 'Tempranillo',
    color: 'red',
    style: 'Medel till fyllig, medel syra och medel tannin. Texturen varierar från frisk och fruktig till tät och ekkryddig beroende på lagring.',
    aromas: 'Körsbär, plommon, jordgubb, torkad frukt, tobak, läder, vanilj och dill (särskilt från amerikansk ek i Rioja). Vid mognad – fikon, läder, nötighet.',
    origin: 'Spaniens signaturdruva. Viktigast i Rioja, Ribera del Duero, Toro, Navarra och flera andra regioner; även planterad i Portugal (som Tinta Roriz/Aragonez).',
    styles: 'Från unga, fruktiga Joven till ekfatslagrade Crianza, Reserva och Gran Reserva. Kan vara både druvrent och blandat med t.ex. Garnacha och Graciano.',
    aging: 'Reserva och Gran Reserva från topproducenter kan utvecklas i 10–25 år. Enklare stilar är utmärkta inom 3–7 år.',
    foodPairing: 'Perfekt till tapas, grillat kött, charkuterier, lamm, paella, hårdostar och grytor med tomat och paprika.'
  },
  // ... Fortsätt med resten av druvorna
  // VITA DRUVOR
  {
    id: 'chardonnay',
    name: 'Chardonnay',
    color: 'white',
    style: 'Medel till fyllig, medel syra. En kameleont som kan vara allt från stram och mineraldriven till rik, smörig och ekad.',
    aromas: 'I svalare klimat: citrus, grönt äpple, mineral. I varmare: gul frukt, tropisk frukt. Med ek och malolaktisk jäsning – smör, vanilj, rostad nöt, brioche.',
    origin: 'Ursprung i Bourgogne (Chablis, Côte de Beaune). Idag global: Kalifornien, Australien, Nya Zeeland, Sydafrika, Chile, m.fl.',
    styles: 'Torra vita viner, både stilla och mousserande (huvuddruva i många Champagner och andra bubbel). Stor variation i ek och vinmakning.',
    aging: 'Kvalitets‑Chardonnay från Bourgogne och topp‑Nya världen kan lagras 10–20 år. Enklare viner är godast inom 2–6 år.',
    foodPairing: 'Oekad/sval Chardonnay till skaldjur, fisk, ostron. Fylligare, fatad stil till kyckling, kalv, smöriga såser, svamprätter och milda ostar.'
  },
  {
    id: 'sauvignon-blanc',
    name: 'Sauvignon Blanc',
    color: 'white',
    style: 'Lätt till medelfyllig, hög syra, frisk och aromatisk.',
    aromas: 'Citrus, lime, krusbär, nässlor, svartvinbärsblad, tropisk frukt (passionsfrukt) i varmare klimat, samt ofta örtiga och mineraliska toner.',
    origin: 'Loire (Sancerre, Pouilly‑Fumé) och Bordeaux (blends). Nya Zeeland (Marlborough) är modern stilikon; även Chile, Sydafrika, Kalifornien.',
    styles: 'Oftast torr, ståltanksjäst för att bevara aromatik. I Bordeaux blandas den ofta med Sémillon, både i torra och söta viner.',
    aging: 'De flesta viner är som bäst unga, inom 2–5 år, men kvalitetsviner från Loire och fatlagrad Sauvignon kan utvecklas 8–10 år.',
    foodPairing: 'Fantastisk till getost, sallader, sparris, skaldjur, ceviche, sushi, lättare fiskrätter och rätter med mycket gröna örter.'
  },
  {
    id: 'riesling',
    name: 'Riesling',
    color: 'white',
    style: 'Lätt till medelfyllig, mycket hög syra. Kan vara allt från knastertorr till ljupt söt.',
    aromas: 'Lime, citron, grönt äpple, stenfrukt, blommighet. Vid mognad ofta petroleum/"diesel", honung och torkad frukt.',
    origin: 'Tyskland (Mosel, Rheingau, Pfalz, Nahe), Alsace, Österrike (Wachau, Kremstal) och Australien (Clare, Eden Valley).',
    styles: 'Stor stilbredd: torr, halvtorr, söt, ädelrötad, mousserande. Ofta ståltanksjäst för att bevara ren frukt.',
    aging: 'Mycket hög, särskilt för kvalitetsviner. Torra topp‑Riesling kan utvecklas 10–20 år, ädelrötade ännu längre.',
    foodPairing: 'Torr Riesling till fisk, skaldjur, sashimi, lätta rätter. Halvtorr/söt Riesling är utmärkt till asiatisk och kryddstark mat, samt foie gras och starkare ostar.'
  }
]

export function GrapeGuide() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedColor, setSelectedColor] = useState<'all' | 'red' | 'white'>('all')
  const [expandedGrape, setExpandedGrape] = useState<string | null>(null)

  const filteredGrapes = grapes.filter(grape => {
    const matchesSearch = grape.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grape.alternativeNames?.some(alt => alt.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesColor = selectedColor === 'all' || grape.color === selectedColor
    return matchesSearch && matchesColor
  })

  const redGrapes = filteredGrapes.filter(g => g.color === 'red')
  const whiteGrapes = filteredGrapes.filter(g => g.color === 'white')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Druvguide</h2>
        <p className="text-gray-600 mt-1">De 50 vanligaste druvorna och deras egenskaper</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sök druva..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedColor('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedColor === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alla ({grapes.length})
            </button>
            <button
              onClick={() => setSelectedColor('red')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedColor === 'red'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Röda ({grapes.filter(g => g.color === 'red').length})
            </button>
            <button
              onClick={() => setSelectedColor('white')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedColor === 'white'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vita ({grapes.filter(g => g.color === 'white').length})
            </button>
          </div>
        </div>
      </div>

      {/* Red Grapes */}
      {(selectedColor === 'all' || selectedColor === 'red') && redGrapes.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Röda druvor</h3>
          <div className="space-y-3">
            {redGrapes.map(grape => (
              <GrapeCard
                key={grape.id}
                grape={grape}
                isExpanded={expandedGrape === grape.id}
                onToggle={() => setExpandedGrape(expandedGrape === grape.id ? null : grape.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* White Grapes */}
      {(selectedColor === 'all' || selectedColor === 'white') && whiteGrapes.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Vita druvor</h3>
          <div className="space-y-3">
            {whiteGrapes.map(grape => (
              <GrapeCard
                key={grape.id}
                grape={grape}
                isExpanded={expandedGrape === grape.id}
                onToggle={() => setExpandedGrape(expandedGrape === grape.id ? null : grape.id)}
              />
            ))}
          </div>
        </div>
      )}

      {filteredGrapes.length === 0 && (
        <div className="text-center py-12">
          <Wine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Inga druvor hittades</h3>
          <p className="text-gray-600">Prova att ändra din sökning</p>
        </div>
      )}
    </div>
  )
}

function GrapeCard({ grape, isExpanded, onToggle }: { grape: Grape; isExpanded: boolean; onToggle: () => void }) {
  const colorClass = grape.color === 'red' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
  const iconColor = grape.color === 'red' ? 'text-red-600' : 'text-yellow-600'

  return (
    <div id={grape.id} className={`bg-white border rounded-lg overflow-hidden transition-all`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center border`}>
            <Wine className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-900">{grape.name}</h4>
            {grape.alternativeNames && (
              <p className="text-sm text-gray-500">({grape.alternativeNames.join(', ')})</p>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          <Section title="Stil & struktur" content={grape.style} />
          <Section title="Aromer & smak" content={grape.aromas} />
          <Section title="Ursprung & viktiga regioner" content={grape.origin} />
          <Section title="Vinstilar & användning" content={grape.styles} />
          <Section title="Lagringspotential" content={grape.aging} />
          <Section title="Mat & vin" content={grape.foodPairing} />
        </div>
      )}
    </div>
  )
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h5 className="font-medium text-gray-900 mb-1">{title}</h5>
      <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
    </div>
  )
}
