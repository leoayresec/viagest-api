"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRecordDto = void 0;
const class_validator_1 = require("class-validator");
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
];
class CreateRecordDto {
    date;
    neighborhood;
    road;
    serviceType;
    supervisor;
    recorder;
    data;
}
exports.CreateRecordDto = CreateRecordDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRecordDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRecordDto.prototype, "neighborhood", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRecordDto.prototype, "road", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(SERVICE_TYPES),
    __metadata("design:type", String)
], CreateRecordDto.prototype, "serviceType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRecordDto.prototype, "supervisor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRecordDto.prototype, "recorder", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateRecordDto.prototype, "data", void 0);
//# sourceMappingURL=create-record.dto.js.map