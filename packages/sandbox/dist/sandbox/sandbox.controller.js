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
exports.SandboxController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const create_sandbox_dto_1 = require("./dto/create-sandbox.dto");
const utils_1 = require("./utils");
let SandboxController = class SandboxController {
    constructor() { }
    runJs(codeProps) {
        return (0, utils_1.runSandbox)(codeProps);
    }
};
exports.SandboxController = SandboxController;
__decorate([
    (0, common_1.Post)('/js'),
    (0, common_1.HttpCode)(200),
    openapi.ApiResponse({ status: 200, type: require("./dto/create-sandbox.dto").RunCodeResponse }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sandbox_dto_1.RunCodeDto]),
    __metadata("design:returntype", void 0)
], SandboxController.prototype, "runJs", null);
exports.SandboxController = SandboxController = __decorate([
    (0, common_1.Controller)('sandbox'),
    __metadata("design:paramtypes", [])
], SandboxController);
//# sourceMappingURL=sandbox.controller.js.map