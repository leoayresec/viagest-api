import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../core/infrastructure/database/prisma.service'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class GeographySeedService {
  private readonly logger = new Logger(GeographySeedService.name)

  constructor(private prisma: PrismaService) {}

  async seed() {
    const stateCount = await this.prisma.state.count()
    const cityCount = await this.prisma.city.count()

    if (stateCount === 0) await this.seedStates()
    if (cityCount < 5000) {
      if (cityCount > 0) await this.prisma.city.deleteMany()
      await this.seedCities()
    }
    await this.seedBelémData()

    const stats = await this.getStats()
    this.logger.log(`Seed: ${stats.states} estados, ${stats.cities} cidades, ${stats.neighborhoods} bairros, ${stats.roads} vias`)
  }

  private async seedStates() {
    this.logger.log('Buscando estados do IBGE...')
    try {
      const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=id')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const states = await res.json()
      await this.prisma.state.createMany({
        data: states.map((s: any) => ({ id: String(s.id), code: s.sigla, name: s.nome })),
        skipDuplicates: true,
      })
      this.logger.log(`${states.length} estados inseridos.`)
    } catch (err) {
      this.logger.error('Erro ao buscar estados do IBGE', err)
    }
  }

  private async seedCities() {
    this.logger.log('Buscando municípios do IBGE...')
    try {
      const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=id')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const cities = await res.json()

      const existingStates = await this.prisma.state.findMany({ select: { id: true } })
      const validStateIds = new Set(existingStates.map((s) => s.id))

      const batchSize = 500
      let inserted = 0
      for (let i = 0; i < cities.length; i += batchSize) {
        const batch = cities
          .slice(i, i + batchSize)
          .filter((c: any) => c.microrregiao?.mesorregiao?.UF?.id != null)
          .map((c: any) => ({
            id: String(c.id),
            stateId: String(c.microrregiao.mesorregiao.UF.id),
            name: c.nome,
            ibgeCode: String(c.id),
          }))
          .filter((c: any) => validStateIds.has(c.stateId))

        if (batch.length > 0) {
          const result = await this.prisma.city.createMany({ data: batch, skipDuplicates: true })
          inserted += result.count
        }
      }
      this.logger.log(`${inserted} municípios inseridos.`)
    } catch (err) {
      this.logger.error('Erro ao buscar municípios do IBGE', err)
    }
  }

  private async seedBelémData() {
    const BELEM_IBGE = '1501402'
    const city = await this.prisma.city.findFirst({ where: { ibgeCode: BELEM_IBGE } })
    if (!city) {
      this.logger.warn('Belém não encontrada no banco. Pulando bairros/ruas.')
      return
    }

    // Carregar dados do JSON gerado pelo OpenStreetMap
    const jsonPath = path.join(process.cwd(), 'bairros-ruas-belem.json')
    if (!fs.existsSync(jsonPath)) {
      this.logger.warn('bairros-ruas-belem.json não encontrado. Pulando.')
      return
    }

    const data: Record<string, string[]> = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    const bairroNames = Object.keys(data).sort()

    this.logger.log(`Inserindo ${bairroNames.length} bairros de Belém...`)

    // Inserir bairros
    for (const name of bairroNames) {
      await this.prisma.neighborhood.upsert({
        where: { cityId_name: { cityId: city.id, name } },
        update: {},
        create: { cityId: city.id, name },
      })
    }

    const dbNeighborhoods = await this.prisma.neighborhood.findMany({
      where: { cityId: city.id },
      select: { id: true, name: true },
    })
    const nameToId = new Map(dbNeighborhoods.map((n) => [n.name, n.id]))

    // Inserir vias
    let insertedRoads = 0
    for (const [bairroName, ruas] of Object.entries(data)) {
      const neighborhoodId = nameToId.get(bairroName)
      if (!neighborhoodId) continue

      for (const ruaName of ruas) {
        try {
          await this.prisma.road.upsert({
            where: { neighborhoodId_name: { neighborhoodId, name: ruaName } },
            update: {},
            create: { neighborhoodId, name: ruaName },
          })
          insertedRoads++
        } catch {
          // skip duplicates
        }
      }
    }

    this.logger.log(`${bairroNames.length} bairros, ${insertedRoads} vias de Belém inseridos.`)
  }

  async getStats() {
    const [states, cities, neighborhoods, roads] = await Promise.all([
      this.prisma.state.count(),
      this.prisma.city.count(),
      this.prisma.neighborhood.count(),
      this.prisma.road.count(),
    ])
    return { states, cities, neighborhoods, roads }
  }
}
