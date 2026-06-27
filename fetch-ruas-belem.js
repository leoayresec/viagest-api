const fs = require('fs')

async function main() {
  // 1. Buscar fronteiras dos bairros (place=suburb/neighborhood) em Belém
  console.log('1/3: Buscando bairros do OSM...')
  const bairrosQuery = `[out:json][timeout:120];area["name"="Belém"]["admin_level"="8"]->.belem;(relation["boundary"="administrative"]["admin_level"~"8|9|10"](area.belem);way["place"~"suburb|neighbourhood"](area.belem);node["place"~"suburb|neighbourhood"](area.belem););out body;`

  const bRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(bairrosQuery)}`, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'ViaGest/1.0' },
    signal: AbortSignal.timeout(120000),
  })
  if (!bRes.ok) { console.error('Bairros error:', bRes.status); return }
  const bairrosData = await bRes.json()
  console.log(`Bairros elements: ${bairrosData.elements.length}`)

  // Extrair nomes dos bairros
  const bairros = bairrosData.elements
    .filter(e => e.tags?.name)
    .map(e => ({ id: e.id, name: e.tags.name, type: e.type, lat: e.lat, lon: e.lon }))
  console.log(`Bairros únicos: ${bairros.length}`)
  bairros.forEach(b => console.log(`  ${b.name} (${b.type}, ${b.lat},${b.lon})`))

  // 2. Buscar ruas
  console.log('\n2/3: Buscando ruas do OSM...')
  const ruasQuery = `[out:json][timeout:120];area["name"="Belém"]["admin_level"="8"]->.belem;(way["highway"~"residential|tertiary|secondary|primary|unclassified|living_street"]["name"](area.belem););out center;`

  const rRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(ruasQuery)}`, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'ViaGest/1.0' },
    signal: AbortSignal.timeout(120000),
  })
  if (!rRes.ok) { console.error('Ruas error:', rRes.status); return }
  const ruasData = await rRes.json()
  console.log(`Ruas elements: ${ruasData.elements.length}`)

  // 3. Mapear ruas para bairros (pelo centro da rua)
  console.log('\n3/3: Mapeando ruas → bairros...')

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  }

  const bairrosRuas = {}
  let matched = 0

  for (const rua of ruasData.elements) {
    const ruaNome = rua.tags?.name
    const ruaLat = rua.center?.lat || rua.lat
    const ruaLon = rua.center?.lon || rua.lon
    if (!ruaNome || !ruaLat || !ruaLon) continue

    // Encontrar bairro mais próximo
    let minDist = Infinity
    let closestBairro = null
    for (const b of bairros) {
      if (!b.lat || !b.lon) continue
      const d = haversine(ruaLat, ruaLon, b.lat, b.lon)
      if (d < minDist) { minDist = d; closestBairro = b.name }
    }

    // Só atribuir se estiver a menos de 3km do centro do bairro
    if (closestBairro && minDist < 3) {
      if (!bairrosRuas[closestBairro]) bairrosRuas[closestBairro] = new Set()
      bairrosRuas[closestBairro].add(ruaNome)
      matched++
    }
  }

  // Converter sets para arrays ordenados
  const output = {}
  for (const [bairro, ruas] of Object.entries(bairrosRuas)) {
    output[bairro] = [...ruas].sort()
  }

  fs.writeFileSync('bairros-ruas-belem.json', JSON.stringify(output, null, 2))

  const totalRuas = Object.values(output).reduce((sum, r) => sum + r.length, 0)
  console.log(`\nSalvo em bairros-ruas-belem.json`)
  console.log(`${Object.keys(output).length} bairros, ${totalRuas} ruas mapeadas`)
  for (const [b, r] of Object.entries(output).sort()) {
    console.log(`  ${b}: ${r.length} ruas`)
  }
}

main()
