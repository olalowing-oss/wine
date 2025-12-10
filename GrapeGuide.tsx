import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
  {
    id: 'sangiovese',
    name: 'Sangiovese',
    color: 'red',
    style: 'Medel till fyllig, hög syra, medel till hög tannin. Elegant med påtaglig struktur – behöver ofta mat eller lagring för att tanniner och syra ska balansera.',
    aromas: 'Sur körsbär, plommon, viol, örter, te, läder och jordighet. Eklagring tillför vanilj, kryddor och tobak.',
    origin: 'Italiens viktigaste röda druva. Mest känd från Toscana: Chianti, Brunello di Montalcino, Vino Nobile di Montepulciano och Super Tuscans.',
    styles: 'Allt från lättare, friskare Chianti till kraftigare Brunello och Rosso di Montalcino. Kan vara druvrent eller blandat med t.ex. Canaiolo eller internationella druvor.',
    aging: 'Kvalitets‑Sangiovese (särskilt Brunello och Riserva) kan lagras 10–30 år. Enklare Chianti är bäst inom 3–8 år.',
    foodPairing: 'Pasta med tomatsås, ragu, grillat kött, biff, kalvkött, hårdostar (särskilt Pecorino och Parmigiano), pizza och tomatbaserade rätter.'
  },
  {
    id: 'nebbiolo',
    name: 'Nebbiolo',
    color: 'red',
    style: 'Medelfyllig till fyllig (trots ljusare färg), mycket hög syra och mycket hög tannin. Kräver ofta lång tid i fat och flaska för att tämjas. Komplex och elegant när den är mogen.',
    aromas: 'Rosor, violer, tjära, lakrits, körsbär, tryffel, läder, undervegetation. Med mognad ofta körsbärslikör och torkade blommor.',
    origin: 'Främst Piemonte: Barolo, Barbaresco och mindre appellationer som Roero och Gattinara. Mindre mängder även i Valtellina (Lombardiet).',
    styles: 'Ofta druvrent. Traditionellt lång maceration och lagring i stora trä‑fat; modernare stilar kan vara mer koncentrerade med kortare maceration. Alltid hög struktur.',
    aging: 'Mycket hög. Barolo och Barbaresco kan utvecklas 15–40 år, ibland längre. Riserva‑versioner kräver ofta en dekad eller mer för att nå sin topp.',
    foodPairing: 'Braserat nötkött, vilt (rådjur, vildsvin), tryffelrätter, risotto, agnolotti, lagrade hårda ostar (Parmigiano, Grana Padano) och magra styckdetaljer.'
  },
  {
    id: 'barbera',
    name: 'Barbera',
    color: 'red',
    style: 'Medel till fyllig, mycket hög syra, relativt låga tanniner. Frisk och saftig, ibland med hög fruktighet.',
    aromas: 'Körsbär, plommon, bär, svarta oliver, örter och kryddor. Ekfat tillför vanilj och kaffe.',
    origin: 'Piemonte är kärnan (Barbera d\'Asti, Barbera d\'Alba), men odlas även i Emilia‑Romagna, Lombardiet och delar av Nya världen.',
    styles: 'Från lättare, fruktigare viner utan ek till mer strukturerade, fatlagrade varianter. Alltid med tydlig syra.',
    aging: 'De flesta är tänkta att drickas unga, inom 3–7 år. Toppviner med ek kan utvecklas 10–15 år.',
    foodPairing: 'Fungerar utmärkt till syrarika tomatbaserade rätter, pasta, risotto, pizza, grillade grönsaker och charkuterier.'
  },
  {
    id: 'malbec',
    name: 'Malbec',
    color: 'red',
    style: 'Medelfyllig till fyllig, medel syra, mjuka tanniner. Frodig fruktighet och rund textur.',
    aromas: 'Mörka bär (björnbär, blåbär), plommon, choklad, kaffe, viol, kryddor och ibland tobak från fat.',
    origin: 'Ursprung i Cahors (sydvästra Frankrike), men idag mest känd från Argentina – särskilt Mendoza. Även i Chile och andra nya regioner.',
    styles: 'Ofta druvrent i Argentina, där det görs både fruktigt och koncentrerat. I Cahors mer stram och jordnära stil.',
    aging: 'Argentinsk Malbec är ofta bäst inom 3–8 år, men kvalitetsviner kan utvecklas 10–15 år. Klassisk Cahors kan lagras ännu längre.',
    foodPairing: 'Perfekt till grillat kött (asado), biff, lamm, hamburgare, köttfärsrätter, empanadas och hårdare ostar.'
  },
  {
    id: 'zinfandel',
    name: 'Zinfandel',
    alternativeNames: ['Primitivo'],
    color: 'red',
    style: 'Medelfyllig till mycket fyllig, medel syra, medel till höga tanniner. Ofta hög alkohol (14–16+ %) och koncentrerad frukt.',
    aromas: 'Mörk frukt (björnbär, plommon), körsbär, kryddor (svartpeppar, kanel), vanilj, kakao och ibland russin/syltig frukt.',
    origin: 'Kalifornien är modernt hem (Sonoma, Paso Robles, Lodi). Ursprungligen från Kroatien (Crljenak Kaštelanski). I Italien känd som Primitivo (Puglia).',
    styles: 'Allt från friska, måttligt alkoholstarka viner till kraftiga "monster Zins". Även White Zinfandel (off‑dry rosé) är vanlig. I Italien ofta lättare stil.',
    aging: 'De flesta är bäst unga, inom 3–7 år. Mer balanserade, kvalitativa exemplar kan utvecklas 10–15 år.',
    foodPairing: 'BBQ, grillat, hamburgare, BBQ‑ribs, pizza, kryddiga rätter, medelstarka ostar och charkuterier.'
  },
  {
    id: 'cabernet-franc',
    name: 'Cabernet Franc',
    color: 'red',
    style: 'Lätt till medelfyllig, medel till hög syra, medel tannin. Lättare och mer örtigt än Cabernet Sauvignon, men med en viss elegans.',
    aromas: 'Röda bär, körsbär, plommon, paprika (särskilt grön), örter, viol och ibland grafit. I varmare klimat mer fruktdriven.',
    origin: 'Loire‑dalen (Chinon, Bourgueil, Saumur‑Champigny) och höger strand i Bordeaux (Saint‑Émilion, Pomerol). Även i Nya världen, t.ex. USA och Chile.',
    styles: 'Kan göras både druvrent (särskilt i Loire) och som viktigt blendkomponent i Bordeaux och världen över. Ofta elegant och örtigt.',
    aging: 'Kvalitetsviner från Loire och Bordeaux kan utvecklas 8–15 år. Enklare viner är godast inom 3–7 år.',
    foodPairing: 'Rillettes, charkuterier, grillade grönsaker, fläsk, grillad lax, kyckling, kryddiga rätter och mjuka ostar.'
  },
  {
    id: 'gamay',
    name: 'Gamay',
    color: 'red',
    style: 'Lätt till medelfyllig, hög syra, låga tanniner. Ofta saftig och lättdrucken med levande fruktighet.',
    aromas: 'Röda bär – jordgubb, hallon, körsbär, blommighet och ibland banan/tuggummi (från kolsyrajäsning).',
    origin: 'Beaujolais i Bourgogne är klassiskt (inkl. de tio Cru‑byarna). Även i Loire och Schweiz (Genève).',
    styles: 'Från lätt och fruktig Beaujolais Nouveau till mer strukturerad Beaujolais Cru. Ofta kolsyrajäsning (carbonic maceration) för fruktdrift.',
    aging: 'Beaujolais Nouveau dricks omedelbart. De flesta Gamay är godast inom 2–5 år. Cru‑viner kan utvecklas 5–10 år.',
    foodPairing: 'Utmärkt till charkuterier, kycklingrätter, grillad fisk, vegetariska rätter, svamprisotto och mjuka ostar. Serveras ofta kyld.'
  },
  {
    id: 'mourvedre',
    name: 'Mourvèdre',
    alternativeNames: ['Monastrell'],
    color: 'red',
    style: 'Medelfyllig till fyllig, medel syra, höga tanniner. Ofta robust och köttig textur.',
    aromas: 'Mörka bär (björnbär, blåbär), plommon, vilt, läder, kött, örter, lakrits och ibland rökighet.',
    origin: 'Spanien (Monastrell, särskilt i Jumilla och Yecla). I Frankrike viktig del i södra Rhône (Bandol, Châteauneuf‑du‑Pape). Även i Californien och Australien.',
    styles: 'Används både druvrent (Bandol, Jumilla) och i GSM‑blends (Grenache–Syrah–Mourvèdre). Kräver varmt klimat för att mogna.',
    aging: 'Kvalitets‑Mourvèdre (t.ex. Bandol) kan lagras 10–20 år. Enklare viner är bäst inom 4–8 år.',
    foodPairing: 'Grillade köttbitar, lamm, vilt, kryddiga korvar, grytor, BBQ och kraftfulla, hårdare ostar.'
  },
  {
    id: 'pinotage',
    name: 'Pinotage',
    color: 'red',
    style: 'Medelfyllig till fyllig, medel syra, medel till höga tanniner. Varierar från fruktig och lättdrucken till kraftig och ekig.',
    aromas: 'Röda bär, plommon, jordiga toner, rök, kaffe, choklad och ibland gummi/aceton vid överdriven vinifiering.',
    origin: 'Sydafrika (korsning mellan Pinot Noir och Cinsault från 1925). Framför allt Stellenbosch och Paarl.',
    styles: 'Stor stilvariation – från färsk och fruktig "café‑stil" till tung, ekfatslagrad "Cape Blend". Kan vara både druvrent och i blends.',
    aging: 'De flesta är godast inom 3–7 år. Mer strukturerade versioner kan utvecklas 8–12 år.',
    foodPairing: 'BBQ, biltong, hamburgare, grillat kött, kryddiga korvar, stuvningar och medelstarka ostar.'
  },
  {
    id: 'carignan',
    name: 'Carignan',
    color: 'red',
    style: 'Medelfyllig till fyllig, hög syra, höga tanniner. Kan vara sträv och mörk i ung ålder, men gammelvinstockar ger koncentration och elegans.',
    aromas: 'Mörka bär, plommon, örter, kryddor, jordighet, ibland violer och lakrits.',
    origin: 'Ursprung i Spanien (Cariñena, Priorat som Samsó). Viktig i södra Frankrike (Languedoc, Roussillon). Även i Chile och Kalifornien.',
    styles: 'Används ofta i blends för att tillföra struktur och syra, men kan också göras druvrent från gamla stockar.',
    aging: 'Kvalitetsviner från gamla stockar kan utvecklas 8–15 år. Enklare viner är bäst inom 3–6 år.',
    foodPairing: 'Grytor, grillat, lamm, kryddiga rätter, medelhavskök, tapas och hårdostar.'
  },
  {
    id: 'cinsault',
    name: 'Cinsault',
    color: 'red',
    style: 'Lätt till medelfyllig, medel syra, låga tanniner. Mjuk och fruktdriven, ofta elegant.',
    aromas: 'Röda bär (jordgubb, hallon, körsbär), blommighet, örter och lätt kryddig ton.',
    origin: 'Sydfrankrike (Languedoc, Rhône) och Sydafrika. Även i Libanon och Nordafrika.',
    styles: 'Används ofta i blends (särskilt i rosé) och sällan druvrent. Ger mjukhet och fruktighet utan tung struktur.',
    aging: 'De flesta viner är bäst unga, inom 2–5 år.',
    foodPairing: 'Lätta kötträtter, kyckling, charkuterier, grillade grönsaker, sommarsallader och mild ost.'
  },
  {
    id: 'touriga-nacional',
    name: 'Touriga Nacional',
    color: 'red',
    style: 'Medelfyllig till fyllig, medel syra, höga tanniner. Koncentrerad och strukturerad, med aromatisk komplexitet.',
    aromas: 'Mörka bär (björnbär, blåbär), viol, rosor, bergamott, lakrits, sten och ibland eukalyptus.',
    origin: 'Portugal, särskilt Douro‑dalen och Dão. Viktig i både portvinstillverkning och torra röda viner.',
    styles: 'Druvrent eller i blends (ofta med Touriga Franca, Tinta Roriz). Görs både som druvrent torrt vin och som bas i portvin.',
    aging: 'Kvalitets‑Touriga Nacional kan utvecklas 10–20 år. Enklare viner är bäst inom 4–8 år.',
    foodPairing: 'Grillat kött, lamm, vilt, kraftfulla grytor, portugalensis kök (bacalhau, cozido) och hårdostar.'
  },
  {
    id: 'corvina',
    name: 'Corvina',
    color: 'red',
    style: 'Medelfyllig, medel syra, låga till medel tanniner. Ofta elegant med en viss bitterhet i eftersmaken (mandel).',
    aromas: 'Sur körsbär, körsbär, röda bär, mandel, örter och ibland torkad frukt (i Amarone).',
    origin: 'Venetoregionen i Italien – viktigaste druvan i Valpolicella, Bardolino och Amarone.',
    styles: 'Används i blends med Rondinella och Molinara. Stilar från lätt Valpolicella till kraftig, torkad‑druvstil Amarone och Ripasso.',
    aging: 'Valpolicella är bäst ung, inom 2–5 år. Ripasso 5–10 år. Amarone kan lagras 15–30 år eller mer.',
    foodPairing: 'Pasta, risotto, kalvkött, anka, fågel, polenta och mjuka till medelstarka ostar. Amarone fungerar även till vilt och lagrade hårda ostar.'
  },
  {
    id: 'nero-davola',
    name: 'Nero d\'Avola',
    color: 'red',
    style: 'Medelfyllig till fyllig, medel syra, medel till höga tanniner. Ofta kraftfull och varm med mogen frukt.',
    aromas: 'Mörka körsbär, plommon, björnbär, kryddor, choklad, tobak och ibland örter.',
    origin: 'Siciliens viktigaste röda druva, särskilt från Noto och sydöstra delarna.',
    styles: 'Druvrent eller i blends. Stil från fruktig och lättare till kraftig och ekfatslagrad.',
    aging: 'Kvalitetsviner kan utvecklas 8–15 år. Enklare viner är bäst inom 3–7 år.',
    foodPairing: 'Pasta med köttsås, grillat kött, lamm, sicilianska rätter, auberginerätter och hårdostar.'
  },
  {
    id: 'dolcetto',
    name: 'Dolcetto',
    color: 'red',
    style: 'Lätt till medelfyllig, låg syra, medel tannin. Mjuk och fruktig med viss bitterhet i finish.',
    aromas: 'Svarta körsbär, plommon, violer, mandel och örter.',
    origin: 'Piemonte, särskilt Dolcetto d\'Alba, Dolcetto d\'Asti och Dolcetto di Dogliani.',
    styles: 'Druvrent, ofta relativt enkelt och färskt. Tänkt att drickas ung.',
    aging: 'De flesta är bäst inom 2–5 år.',
    foodPairing: 'Charkuterier, pizza, pasta, grillade grönsaker, vardagsmat och mjuka ostar.'
  },
  {
    id: 'bobal',
    name: 'Bobal',
    color: 'red',
    style: 'Medelfyllig till fyllig, medel syra, höga tanniner. Mörk färg och koncentrerad frukt.',
    aromas: 'Mörka bär, plommon, örter, kryddor och jordighet.',
    origin: 'Östspanien, främst Utiel‑Requena i Valencia. Används även för rosé och cava.',
    styles: 'Druvrent eller i blends. Ofta använd som färg‑ och strukturdruva. Även vanlig i rosé.',
    aging: 'Kvalitetsviner kan utvecklas 8–12 år. Enklare viner är bäst inom 3–6 år.',
    foodPairing: 'Paella, grillat kött, tapas, grytor och medelstarka ostar.'
  },
  {
    id: 'tannat',
    name: 'Tannat',
    color: 'red',
    style: 'Fyllig, medel syra, mycket höga tanniner. Ofta robust och kraftfull.',
    aromas: 'Mörka bär (björnbär, blåbär), plommon, viol, läder, kryddor och ibland choklad.',
    origin: 'Ursprung i sydvästra Frankrike (Madiran). Idag mest känd från Uruguay.',
    styles: 'Druvrent eller i blends. Kräver ofta lång lagring för att tämja tanninerna.',
    aging: 'Kvalitets‑Tannat kan lagras 10–20 år eller mer. Enklare stilar är bäst inom 5–10 år.',
    foodPairing: 'Grillat kött, lamm, vilt, fetare kötträtter, asado och hårdostar.'
  },
  {
    id: 'aglianico',
    name: 'Aglianico',
    color: 'red',
    style: 'Fyllig, hög syra, mycket höga tanniner. Kräver ofta lång mognad. Kallas ibland "söderns Nebbiolo".',
    aromas: 'Mörka körsbär, plommon, tjära, läder, örter, svartpeppar och jordighet.',
    origin: 'Södra Italien, särskilt Taurasi (Kampanien) och Aglianico del Vulture (Basilicata).',
    styles: 'Druvrent. Traditionellt lång lagring i stora fat. Kräver tid för att mjukna.',
    aging: 'Mycket hög – kvalitetsviner kan lagras 15–30 år eller mer.',
    foodPairing: 'Vilt, lamm, mustig pasta, grillat kött, lagrade ostar och kraftfulla italienska rätter.'
  },
  {
    id: 'pinot-meunier',
    name: 'Pinot Meunier',
    color: 'red',
    style: 'Lätt till medelfyllig, medel syra, låga tanniner. Mjukare och mer omedelbart tillgänglig än Pinot Noir.',
    aromas: 'Röda bär, äpple, blommighet och ibland örter.',
    origin: 'Champagne‑regionen, där den är en av tre huvuddruvor (tillsammans med Pinot Noir och Chardonnay). Även i vissa tyska områden (Schwarzriesling).',
    styles: 'Främst i mousserande vin (Champagne), sällan druvrent. Tillför fruktighet och mjukhet till blends.',
    aging: 'Som stilla vin är det bäst ungt, inom 2–5 år. I Champagne bidrar det till vinets ungdomliga fruktighet.',
    foodPairing: 'Som del av Champagne: skaldjur, lättare förrätter, sushi, aperitif.'
  },
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
  },
  {
    id: 'pinot-grigio',
    name: 'Pinot Grigio',
    alternativeNames: ['Pinot Gris'],
    color: 'white',
    style: 'Lätt till medelfyllig, medel till hög syra. Pinot Grigio (italiensk stil) är lättare och fräschare, Pinot Gris (Alsace‑stil) fylligare och mer aromatisk.',
    aromas: 'Citrus, grönt äpple, päron, blommor, mineraler. Alsace‑stil kan ha honung, kryddor och tropisk frukt.',
    origin: 'Italien (främst Veneto, Trentino‑Alto Adige, Friuli) och Alsace. Även i Oregon, Nya Zeeland och Tyskland.',
    styles: 'Lättare italiensk stil (Pinot Grigio) vs fylligare, ibland ekad Alsace‑stil (Pinot Gris).',
    aging: 'De flesta är bäst unga, inom 2–4 år. Alsace‑versioner kan utvecklas 5–8 år.',
    foodPairing: 'Pinot Grigio: sallader, lättare fiskrätter, skaldjur, sushi. Pinot Gris: fläsk, fjäderfä, smöriga såser, svamp.'
  },
  {
    id: 'chenin-blanc',
    name: 'Chenin Blanc',
    color: 'white',
    style: 'Lätt till medelfyllig, mycket hög syra. Stor stilvariation från knastertorr till ljuvligt söt.',
    aromas: 'Grönt äpple, päron, honung, blomster, quince, chamomile, våt ull. Med ålder – honung, bivax, torkad frukt.',
    origin: 'Loire‑dalen (Vouvray, Savennières, Anjou) är klassisk. Viktig i Sydafrika. Även i Kalifornien och Argentina.',
    styles: 'Torr, halvtorr, söt (ädelrötad), mousserande. Används även till destillat. Stor variation beroende på terroir och vinifiering.',
    aging: 'Mycket hög. Kvalitets‑Chenin från Loire och Sydafrika kan utvecklas 10–30 år eller mer.',
    foodPairing: 'Torr Chenin: fisk, fjäderfä, skaldjur, grönsaksrätter. Söt Chenin: foie gras, desserter, blåmögelost.'
  },
  {
    id: 'gewurztraminer',
    name: 'Gewürztraminer',
    color: 'white',
    style: 'Medelfyllig, låg till medel syra, ofta lite högre alkohol. Mycket aromatisk och expressiv.',
    aromas: 'Lychee, ros, parfym, kryddor (ingefära, kanel), tropisk frukt, honung. Intensivt aromatisk.',
    origin: 'Alsace är klassiskt, men odlas även i Tyskland, Italien (Alto Adige), Östeuropa, Nya Zeeland och USA.',
    styles: 'Kan vara torr, halvtorr eller söt (vendange tardive, sélection de grains nobles). Ofta låg syra men hög aromatik.',
    aging: 'De flesta är bäst unga, inom 3–6 år. Toppviner från Alsace kan utvecklas 8–15 år.',
    foodPairing: 'Asiatisk mat (thai, indisk), kryddstark mat, foie gras, starka ostar (Munster), rökta rätter.'
  },
  {
    id: 'viognier',
    name: 'Viognier',
    color: 'white',
    style: 'Medelfyllig till fyllig, låg syra, ofta hög alkohol. Fyllig textur och aromatisk.',
    aromas: 'Aprikos, persika, honungsmelon, blommor (viol, kaprifol), kryddor och ibland mineraler.',
    origin: 'Norra Rhône (Condrieu, Château‑Grillet). Även i Languedoc, Kalifornien, Australien och Chile.',
    styles: 'Oftast torr och druvrent, ibland ekfatslagrad. Används även som små tillsatser i röda Syrah‑viner (Côte‑Rôtie).',
    aging: 'De flesta är bäst unga, inom 2–5 år. Kvalitetsviner från Condrieu kan utvecklas 5–10 år.',
    foodPairing: 'Skaldjur (hummer, krabba), fisk med rika såser, fjäderfä, kryddiga asiatiska rätter, mjuka ostar.'
  },
  {
    id: 'semillon',
    name: 'Sémillon',
    color: 'white',
    style: 'Medelfyllig, låg till medel syra. Fyllig textur, särskilt när ekad eller ädelrötad.',
    aromas: 'Citrus, grönt äpple, honung, bivax, fikon, nötter. Ädelrötad version: marmelad, honung, aprikos.',
    origin: 'Bordeaux (både torra och söta viner – Sauternes, Barsac) och Australien (Hunter Valley).',
    styles: 'Torr (ofta blend med Sauvignon Blanc), söt ädelrötad (Sauternes), eller druvrent. Kan vara oekad eller ekad.',
    aging: 'Torra viner: 3–8 år. Ädelrötad Sémillon (Sauternes) kan lagras 20–50 år eller mer.',
    foodPairing: 'Torr Sémillon: fisk, skaldjur, fjäderfä. Söt Sémillon: foie gras, blåmögelost, fruktdesserter.'
  },
  {
    id: 'albarino',
    name: 'Albariño',
    alternativeNames: ['Alvarinho'],
    color: 'white',
    style: 'Lätt till medelfyllig, hög syra, frisk och aromatisk.',
    aromas: 'Citrus, persika, aprikos, blommor, saltvattenton, mineraler.',
    origin: 'Rías Baixas i Galicien (nordvästra Spanien) och Vinho Verde i Portugal (som Alvarinho).',
    styles: 'Oftast torr, ståltanksjäst, fräsch och fruktig. Ibland kortare kontakt med jästfällningar för mer textur.',
    aging: 'De flesta är bäst unga, inom 2–4 år.',
    foodPairing: 'Utmärkt till skaldjur, ostron, fisk, ceviche, tapas och lättare sallader.'
  },
  {
    id: 'verdejo',
    name: 'Verdejo',
    color: 'white',
    style: 'Lätt till medelfyllig, medel till hög syra. Frisk och aromatisk.',
    aromas: 'Citrus, grönt äpple, fänkål, örter, tropisk frukt, ibland nötter och cremighet från jästkontakt.',
    origin: 'Rueda i Kastilien och León, Spanien.',
    styles: 'Oftast torr och ståltanksjäst, ibland med jästkontakt eller lätt ek för mer textur.',
    aging: 'De flesta är bäst unga, inom 2–4 år.',
    foodPairing: 'Tapas, skaldjur, fisk, sallader, vitare kötträtter, grillad bläckfisk.'
  },
  {
    id: 'gruner-veltliner',
    name: 'Grüner Veltliner',
    color: 'white',
    style: 'Lätt till medelfyllig, hög syra, frisk och kryddig.',
    aromas: 'Citrus, grönt äpple, vit peppar, örter, mineraler. Toppviner kan ha honung och nötighet.',
    origin: 'Österrike, särskilt Wachau, Kamptal, Kremstal och Wien.',
    styles: 'Från lättare, fräscha viner till mer koncentrerade och ekade versioner. Ofta ståltank.',
    aging: 'Enklare viner: 2–4 år. Kvalitetsviner (särskilt från Wachau) kan utvecklas 8–15 år.',
    foodPairing: 'Schnitzel, fisk, skaldjur, sparris, grönsaksrätter, asiatisk mat, getost.'
  },
  {
    id: 'moscato',
    name: 'Moscato',
    alternativeNames: ['Muscat'],
    color: 'white',
    style: 'Lätt, låg alkohol (ofta 5–7%), söt eller halvtorr. Aromatisk och lättdrucken.',
    aromas: 'Druva, persika, aprikos, citrus, blommor, honung. Mycket aromatisk och fruktig.',
    origin: 'Italien (Moscato d\'Asti, Asti Spumante), Frankrike (Muscat de Beaumes‑de‑Venise), Spanien, Grekland.',
    styles: 'Söt mousserande (Moscato d\'Asti), torr mousserande (Asti), torra vita viner, likörvin (Muscat).',
    aging: 'De flesta är bäst unga och färska, inom 1–3 år.',
    foodPairing: 'Desserter, frukt, lätta kakor, aperitif. Moscato d\'Asti är perfekt till panettone.'
  },
  {
    id: 'glera',
    name: 'Glera',
    color: 'white',
    style: 'Lätt, hög syra, frisk och fruktig. Huvuddruvan i Prosecco.',
    aromas: 'Grönt äpple, päron, citrus, vita blommor, honung.',
    origin: 'Venetoregionen i Italien, särskilt Prosecco DOCG (Conegliano‑Valdobbiadene).',
    styles: 'Främst mousserande (Prosecco), ibland stilla vin. Charmat‑metoden (tank) för att bevara fruktighet.',
    aging: 'Bäst ung och färsk, inom 1–2 år.',
    foodPairing: 'Aperitif, lättare förrätter, skaldjur, risotto, aperol spritz.'
  },
  {
    id: 'trebbiano',
    name: 'Trebbiano',
    alternativeNames: ['Ugni Blanc'],
    color: 'white',
    style: 'Lätt till medelfyllig, hög syra, neutral i smak.',
    aromas: 'Citrus, grönt äpple, blommor. Ofta neutral och frisk.',
    origin: 'Italien (Trebbiano) och Frankrike (Ugni Blanc). Använd i Cognac och Armagnac, samt i många italienska vita viner.',
    styles: 'Stilla vita viner, ofta i blends. Viktig för destillat (Cognac, Armagnac).',
    aging: 'De flesta är bäst unga, inom 2–3 år.',
    foodPairing: 'Fisk, skaldjur, lätta pastarätter, sallader.'
  },
  {
    id: 'garganega',
    name: 'Garganega',
    color: 'white',
    style: 'Medelfyllig, medel syra, kan vara både frisk och fyllig.',
    aromas: 'Citrus, mandel, vita blommor, honung. I Recioto‑stil: torkad frukt, honung.',
    origin: 'Venetoregionen, Italien. Huvuddruvan i Soave.',
    styles: 'Torr (Soave), söt (Recioto di Soave). Från enkel ståltank till mer komplex ekad stil.',
    aging: 'Enklare Soave: 2–4 år. Kvalitets‑Soave Classico kan utvecklas 5–10 år.',
    foodPairing: 'Fisk, risotto, fjäderfä, mandel‑baserade rätter, mjuka ostar.'
  },
  {
    id: 'verdicchio',
    name: 'Verdicchio',
    color: 'white',
    style: 'Medelfyllig, hög syra, frisk och mineralisk.',
    aromas: 'Citrus, grönt äpple, mandel, örter, saltvattenton, mineraler.',
    origin: 'Marche‑regionen, Italien (Verdicchio dei Castelli di Jesi, Verdicchio di Matelica).',
    styles: 'Oftast torr, ståltanksjäst. Kan också vara ekad eller sparkling.',
    aging: 'Enklare viner: 2–5 år. Kvalitetsviner kan utvecklas 5–10 år.',
    foodPairing: 'Skaldjur, fisk, friterad fisk (fritto misto), pasta med skaldjur.'
  },
  {
    id: 'fiano',
    name: 'Fiano',
    color: 'white',
    style: 'Medelfyllig, medel syra, fyllig textur och aromatisk.',
    aromas: 'Honung, nötter, päron, aprikos, örter, mineraler.',
    origin: 'Kampanien, södra Italien (Fiano di Avellino).',
    styles: 'Torr, ofta ståltank, ibland ekad. Kan utveckla nötig komplexitet.',
    aging: 'De flesta är bäst inom 3–6 år. Kvalitetsviner kan utvecklas 8–12 år.',
    foodPairing: 'Fisk, skaldjur, fjäderfä, pasta med nötsås, milda ostar.'
  },
  {
    id: 'vermentino',
    name: 'Vermentino',
    color: 'white',
    style: 'Lätt till medelfyllig, hög syra, frisk och aromatisk.',
    aromas: 'Citrus, grönt äpple, vita blommor, örter, saltvattenton.',
    origin: 'Sardinien, Ligurien (som Pigato), Toscana (som Vermentino) och Korsika (som Rolle).',
    styles: 'Oftast torr, fräsch och fruktig. Ibland ekad för mer textur.',
    aging: 'De flesta är bäst unga, inom 2–4 år.',
    foodPairing: 'Skaldjur, fisk, pesto, medelhavskök, sallader.'
  },
  {
    id: 'torrontes',
    name: 'Torrontés',
    color: 'white',
    style: 'Lätt till medelfyllig, medel syra, aromatisk och fruktig.',
    aromas: 'Blommor (ros, jasmin), lychee, persika, citrus, muskat.',
    origin: 'Argentina, särskilt Salta och La Rioja (argentinska).',
    styles: 'Torr, aromatisk, ståltanksjäst. Liknar Gewürztraminer i aromintensitet.',
    aging: 'Bäst ung, inom 2–4 år.',
    foodPairing: 'Asiatisk mat, kryddstark mat, skaldjur, ceviche, aperitif.'
  },
  {
    id: 'godello',
    name: 'Godello',
    color: 'white',
    style: 'Medelfyllig, hög syra, mineralisk och elegant.',
    aromas: 'Citrus, stenfrukt, örter, mineraler, ibland nötig ton från ek.',
    origin: 'Galicien, nordvästra Spanien (Valdeorras, Bierzo).',
    styles: 'Torr, ofta ståltank, ibland ekad. Allt mer populär för sin elegans.',
    aging: 'De flesta är bäst inom 3–6 år. Ekade versioner kan utvecklas 6–10 år.',
    foodPairing: 'Fisk, skaldjur, fjäderfä, grillade grönsaker, tapas.'
  },
  {
    id: 'cortese',
    name: 'Cortese',
    color: 'white',
    style: 'Lätt till medelfyllig, hög syra, frisk och mineralisk.',
    aromas: 'Citrus, grönt äpple, vita blommor, mineraler.',
    origin: 'Piemonte, Italien (Gavi/Cortese di Gavi).',
    styles: 'Torr, ståltanksjäst, fräsch. Ibland ekad eller jästkontakt.',
    aging: 'De flesta är bäst unga, inom 2–4 år.',
    foodPairing: 'Skaldjur, fisk, risotto, pesto, lättare pastarätter.'
  },
  {
    id: 'marsanne',
    name: 'Marsanne',
    color: 'white',
    style: 'Medelfyllig till fyllig, låg till medel syra, rik textur.',
    aromas: 'Honungsmelon, aprikos, mandel, blommor, honung.',
    origin: 'Norra Rhône (Hermitage, Crozes‑Hermitage, Saint‑Joseph), ofta tillsammans med Roussanne.',
    styles: 'Torr, ofta ekad. Används i blends med Roussanne och Viognier.',
    aging: 'Kvalitetsviner kan utvecklas 8–15 år.',
    foodPairing: 'Fisk med rika såser, fjäderfä, svamp, nötbaserade rätter.'
  },
  {
    id: 'roussanne',
    name: 'Roussanne',
    color: 'white',
    style: 'Medelfyllig, medel syra, aromatisk och komplex.',
    aromas: 'Örter, päron, honung, te, blommor, mineraler.',
    origin: 'Norra Rhône (Hermitage, Châteauneuf‑du‑Pape), ofta tillsammans med Marsanne.',
    styles: 'Torr, ofta ekad. Används i blends eller druvrent.',
    aging: 'Kvalitetsviner kan utvecklas 8–15 år.',
    foodPairing: 'Fisk, skaldjur, fjäderfä, medelstarka ostar, komplex vegetarisk mat.'
  },
  {
    id: 'airen',
    name: 'Airén',
    color: 'white',
    style: 'Lätt, låg syra, neutral. Världens mest planterade vita druva (ytvise).',
    aromas: 'Neutral, lätta citrusnoter.',
    origin: 'La Mancha, Spanien.',
    styles: 'Enkla, färska vita viner. Används även för destillat (Brandy de Jerez).',
    aging: 'Bäst mycket ung, inom 1–2 år.',
    foodPairing: 'Enkla rätter, tapas, vardagsdryck.'
  },
  {
    id: 'palomino-fino',
    name: 'Palomino Fino',
    color: 'white',
    style: 'Neutral som stilla vin, men huvuddruva för Sherry.',
    aromas: 'Som stilla vin: neutral, mandel. Som Sherry: mandel, jäst, salt, oxidativa toner.',
    origin: 'Jerez, Andalusien, Spanien.',
    styles: 'Främst Sherry (Fino, Manzanilla, Amontillado, Oloroso). Sällan som stilla vin.',
    aging: 'Som Sherry varierar lagring kraftigt – från några år till decennier.',
    foodPairing: 'Fino/Manzanilla: tapas, skaldjur, oliver. Oloroso: nötter, charkuterier, kraftfullare rätter.'
  }
]

export function GrapeGuide() {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedColor, setSelectedColor] = useState<'all' | 'red' | 'white'>('all')
  const [expandedGrape, setExpandedGrape] = useState<string | null>(null)

  // Handle anchor navigation and auto-expand grape
  useEffect(() => {
    if (location.hash) {
      const grapeId = location.hash.substring(1) // Remove the #

      // Find and expand the grape
      const grape = grapes.find(g => g.id === grapeId)
      if (grape) {
        setExpandedGrape(grapeId)

        // Scroll to the element after a short delay to ensure it's rendered
        setTimeout(() => {
          const element = document.getElementById(grapeId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 100)
      }
    }
  }, [location.hash])

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
