"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeDelay = void 0;
const timeDelay = (time) => {
    return new Promise((resolve, reject) => {
        if (time > 10000) {
            reject('Delay time must be less than 10');
        }
        setTimeout(() => {
            resolve('');
        }, time);
    });
};
exports.timeDelay = timeDelay;
//# sourceMappingURL=delay.js.map