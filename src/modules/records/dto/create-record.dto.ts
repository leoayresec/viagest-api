import { IsString, IsOptional, IsDateString, IsObject, IsEnum } from 'class-validator'

const SERVICE_TYPES = [
  'limpeza', 'obs_limpeza',
  'escavacao', 'colchao_areia', 'tubo', 'manta_bidim', 'aterro', 'obs_drenagem', 'motor',
  'pv', 'bl', 'obs_pvbl', 'espinha_bl',
  'terrap', 'obs_terrap',
  'subbase', 'cbuq', 'binder', 'pintura_ligacao', 'obs_pav',
  'tampao_70', 'fresagem', 'remendo_profundo', 'obs_recuperacao',
  'demolicao_calcada', 'demolicao_meiofio', 'colchao_areia_meiofio',
  'demolicao_linha_agua', 'linha_agua', 'urb', 'obs_urb', 'urb_controle',
  'redes_auxiliares', 'rede_domiciliar', 'info_adicionais',
] as const

export type ServiceType = (typeof SERVICE_TYPES)[number]

export class CreateRecordDto {
  @IsDateString()
  date: string

  @IsString()
  roadId: string

  @IsEnum(SERVICE_TYPES as any)
  serviceType: ServiceType

  @IsOptional()
  @IsString()
  supervisorId?: string

  @IsOptional()
  @IsString()
  recorderId?: string

  @IsOptional()
  @IsString()
  recorderName?: string

  @IsObject()
  data: Record<string, any>
}
