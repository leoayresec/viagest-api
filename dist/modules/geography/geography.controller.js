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
exports.GeographyController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const geography_service_1 = require("./geography.service");
const geography_seed_service_1 = require("./geography-seed.service");
const roles_decorator_1 = require("../../core/security/roles.decorator");
const roles_guard_1 = require("../../core/security/roles.guard");
let GeographyController = class GeographyController {
    geographyService;
    geographySeedService;
    constructor(geographyService, geographySeedService) {
        this.geographyService = geographyService;
        this.geographySeedService = geographySeedService;
    }
    getStats() {
        return this.geographySeedService.getStats();
    }
    findStates() {
        return this.geographyService.findStates();
    }
    findCities(stateId) {
        return this.geographyService.findCitiesByState(stateId);
    }
    findNeighborhoods(cityId) {
        return this.geographyService.findNeighborhoods(cityId);
    }
    createNeighborhood(body) {
        return this.geographyService.createNeighborhood(body.cityId, body.name);
    }
    deleteNeighborhood(id) {
        return this.geographyService.deleteNeighborhood(id);
    }
    findRoads(neighborhoodId) {
        return this.geographyService.findRoads(neighborhoodId);
    }
    createRoad(body) {
        return this.geographyService.createRoad(body.neighborhoodId, body.name, body.lengthM, body.widthM);
    }
    updateRoad(id, body) {
        return this.geographyService.updateRoad(id, body);
    }
    deleteRoad(id) {
        return this.geographyService.deleteRoad(id);
    }
    findTeam(role) {
        return this.geographyService.findTeamMembers(role);
    }
};
exports.GeographyController = GeographyController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GeographyController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('states'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GeographyController.prototype, "findStates", null);
__decorate([
    (0, common_1.Get)('cities'),
    __param(0, (0, common_1.Query)('stateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GeographyController.prototype, "findCities", null);
__decorate([
    (0, common_1.Get)('neighborhoods'),
    __param(0, (0, common_1.Query)('cityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GeographyController.prototype, "findNeighborhoods", null);
__decorate([
    (0, common_1.Post)('neighborhoods'),
    (0, roles_decorator_1.RequirePermissions)('settings:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GeographyController.prototype, "createNeighborhood", null);
__decorate([
    (0, common_1.Delete)('neighborhoods/:id'),
    (0, roles_decorator_1.RequirePermissions)('settings:write'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GeographyController.prototype, "deleteNeighborhood", null);
__decorate([
    (0, common_1.Get)('roads'),
    __param(0, (0, common_1.Query)('neighborhoodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GeographyController.prototype, "findRoads", null);
__decorate([
    (0, common_1.Post)('roads'),
    (0, roles_decorator_1.RequirePermissions)('settings:write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GeographyController.prototype, "createRoad", null);
__decorate([
    (0, common_1.Post)('roads/:id'),
    (0, roles_decorator_1.RequirePermissions)('settings:write'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GeographyController.prototype, "updateRoad", null);
__decorate([
    (0, common_1.Delete)('roads/:id'),
    (0, roles_decorator_1.RequirePermissions)('settings:write'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GeographyController.prototype, "deleteRoad", null);
__decorate([
    (0, common_1.Get)('team'),
    __param(0, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GeographyController.prototype, "findTeam", null);
exports.GeographyController = GeographyController = __decorate([
    (0, common_1.Controller)('geography'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [geography_service_1.GeographyService,
        geography_seed_service_1.GeographySeedService])
], GeographyController);
//# sourceMappingURL=geography.controller.js.map