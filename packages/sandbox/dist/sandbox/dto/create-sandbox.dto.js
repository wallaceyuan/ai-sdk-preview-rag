"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunCodeResponse = exports.RunCodeDto = void 0;
const openapi = require("@nestjs/swagger");
class RunCodeDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String }, variables: { required: true, type: () => Object } };
    }
}
exports.RunCodeDto = RunCodeDto;
class RunCodeResponse {
    static _OPENAPI_METADATA_FACTORY() {
        return { codeReturn: { required: true, type: () => Object }, log: { required: true, type: () => String } };
    }
}
exports.RunCodeResponse = RunCodeResponse;
//# sourceMappingURL=create-sandbox.dto.js.map