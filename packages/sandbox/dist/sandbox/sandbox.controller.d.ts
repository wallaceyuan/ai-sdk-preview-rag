import { RunCodeDto } from './dto/create-sandbox.dto';
export declare class SandboxController {
    constructor();
    runJs(codeProps: RunCodeDto): Promise<import("./dto/create-sandbox.dto").RunCodeResponse>;
}
