"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countToken = void 0;
const lite_1 = require("tiktoken/lite");
const cl100k_base = require('tiktoken/encoders/cl100k_base');
const countToken = (text = '') => {
    const enc = new lite_1.Tiktoken(cl100k_base.bpe_ranks, cl100k_base.special_tokens, cl100k_base.pat_str);
    const encodeText = enc.encode(text);
    return encodeText.length;
};
exports.countToken = countToken;
//# sourceMappingURL=index.js.map