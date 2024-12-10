import { RunCodeDto, RunCodeResponse } from 'src/sandbox/dto/create-sandbox.dto';
export declare const runSandbox: ({ code, variables }: RunCodeDto) => Promise<RunCodeResponse>;
