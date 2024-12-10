"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSandbox = void 0;
const isolated_vm_1 = require("isolated-vm");
const tiktoken_1 = require("./jsFn/tiktoken");
const delay_1 = require("./jsFn/delay");
const CustomLogStr = 'CUSTOM_LOG';
function getFnCode(code) {
    const rewriteSystemFn = `
    const thisDelay = (...args) => global_delay.applySyncPromise(undefined,args)
`;
    code = code.replace(/delay\((.*)\)/g, `thisDelay($1)`);
    code = code.replace(/console\.log/g, `${CustomLogStr}`);
    const runCode = `
    (async() => { 
        try {
            ${rewriteSystemFn}
            ${code}

            const res = await main(variables, {})
            return JSON.stringify(res);
        } catch(err) {
            return JSON.stringify({ERROR: err?.message ?? err})
        }
    })
`;
    return runCode;
}
function registerSystemFn(jail) {
    return Promise.all([
        jail.set('global_delay', new isolated_vm_1.Reference(delay_1.timeDelay)),
        jail.set('countToken', tiktoken_1.countToken)
    ]);
}
const runSandbox = async ({ code, variables = {} }) => {
    const logData = [];
    const isolate = new isolated_vm_1.Isolate({ memoryLimit: 32 });
    const context = await isolate.createContext();
    const jail = context.global;
    try {
        await Promise.all([
            jail.set('variables', new isolated_vm_1.ExternalCopy(variables).copyInto()),
            jail.set(CustomLogStr, function (...args) {
                logData.push(args
                    .map((item) => (typeof item === 'object' ? JSON.stringify(item, null, 2) : item))
                    .join(', '));
            }),
            registerSystemFn(jail)
        ]);
        const fn = await context.eval(getFnCode(code), { reference: true, timeout: 10000 });
        try {
            const value = await fn.apply(undefined, [], { result: { promise: true } });
            const result = JSON.parse(value.toLocaleString());
            context.release();
            isolate.dispose();
            if (result.ERROR) {
                return Promise.reject(result.ERROR);
            }
            return {
                codeReturn: result,
                log: logData.join('\n')
            };
        }
        catch (error) {
            context.release();
            isolate.dispose();
            return Promise.reject('Not an invalid response.You must return an object');
        }
    }
    catch (err) {
        console.log(err);
        context.release();
        isolate.dispose();
        return Promise.reject(err);
    }
};
exports.runSandbox = runSandbox;
//# sourceMappingURL=utils.js.map