"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./core/infrastructure/database/prisma.module");
const security_module_1 = require("./core/security/security.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const records_module_1 = require("./modules/records/records.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, security_module_1.SecurityModule, auth_module_1.AuthModule, users_module_1.UsersModule, records_module_1.RecordsModule],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_PIPE,
                useFactory: () => new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map