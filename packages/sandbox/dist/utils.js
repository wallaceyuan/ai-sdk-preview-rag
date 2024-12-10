"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrText = exports.replaceSensitiveText = void 0;
const replaceSensitiveText = (text) => {
    text = text.replace(/(?<=https?:\/\/)[^\s]+/g, 'xxx');
    text = text.replace(/ns-[\w-]+/g, 'xxx');
    return text;
};
exports.replaceSensitiveText = replaceSensitiveText;
const getErrText = (err, def = '') => {
    const msg = typeof err === 'string' ? err : err?.message ?? def;
    msg && console.log('error =>', msg);
    return (0, exports.replaceSensitiveText)(msg);
};
exports.getErrText = getErrText;
//# sourceMappingURL=utils.js.map