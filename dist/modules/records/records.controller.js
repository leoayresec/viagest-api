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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const records_service_1 = require("./records.service");
const create_record_dto_1 = require("./dto/create-record.dto");
const create_records_batch_dto_1 = require("./dto/create-records-batch.dto");
const roles_decorator_1 = require("../../core/security/roles.decorator");
const roles_guard_1 = require("../../core/security/roles.guard");
const current_user_decorator_1 = require("../../core/security/current-user.decorator");
let RecordsController = class RecordsController {
    recordsService;
    constructor(recordsService) {
        this.recordsService = recordsService;
    }
    create(dto, userId) {
        return this.recordsService.create(dto, userId);
    }
    createBatch(dto, userId) {
        return this.recordsService.createBatch(dto, userId);
    }
    findAll(date, start, end, neighborhood, road, recorder) {
        return this.recordsService.findAll({ date, start, end, neighborhood, road, recorder });
    }
    findOne(id) {
        return this.recordsService.findOne(id);
    }
    remove(id) {
        return this.recordsService.remove(id);
    }
    removeBatch(body) {
        return this.recordsService.removeBatch(body.ids);
    }
};
exports.RecordsController = RecordsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.RequirePermissions)('records:create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_record_dto_1.CreateRecordDto, String]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('batch'),
    (0, roles_decorator_1.RequirePermissions)('records:create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_records_batch_dto_1.CreateRecordsBatchDto, String]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "createBatch", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.RequirePermissions)('records:read'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('start')),
    __param(2, (0, common_1.Query)('end')),
    __param(3, (0, common_1.Query)('neighborhood')),
    __param(4, (0, common_1.Query)('road')),
    __param(5, (0, common_1.Query)('recorder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.RequirePermissions)('records:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.RequirePermissions)('records:write'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('batch'),
    (0, roles_decorator_1.RequirePermissions)('records:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecordsController.prototype, "removeBatch", null);
exports.RecordsController = RecordsController = __decorate([
    (0, common_1.Controller)('records'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [records_service_1.RecordsService])
], RecordsController);
//# sourceMappingURL=records.controller.js.map