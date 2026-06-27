declare const SERVICE_TYPES: readonly ["limpeza", "obs_limpeza", "escavacao", "colchao_areia", "tubo", "manta_bidim", "aterro", "obs_drenagem", "motor", "pv", "bl", "obs_pvbl", "espinha_bl", "terrap", "obs_terrap", "subbase", "cbuq", "binder", "pintura_ligacao", "obs_pav", "tampao_70", "fresagem", "remendo_profundo", "obs_recuperacao", "demolicao_calcada", "demolicao_meiofio", "colchao_areia_meiofio", "demolicao_linha_agua", "linha_agua", "urb", "obs_urb", "urb_controle", "redes_auxiliares", "rede_domiciliar", "info_adicionais"];
export type ServiceType = (typeof SERVICE_TYPES)[number];
export declare class CreateRecordDto {
    date: string;
    roadId: string;
    serviceType: ServiceType;
    supervisorId?: string;
    recorderId?: string;
    recorderName?: string;
    data: Record<string, any>;
}
export {};
