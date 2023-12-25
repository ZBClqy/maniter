interface DefaultOptions {
    uuid: string | undefined;
    requestUrl: string | undefined;
    historyManiter: boolean;
    hashManiter: boolean;
    domManiter: boolean;
    sdkVersion: string | number;
    extra: Record<string, any> | undefined;
    jsError: boolean;
}
interface Options extends DefaultOptions {
    requestUrl: string;
}

declare class Maniter {
    data: Options;
    constructor(options: Options);
    private initDef;
    setUserId<T extends DefaultOptions['uuid']>(uuid: T): void;
    setExtra<T extends DefaultOptions['extra']>(extra: T): void;
    sendManiter<T>(data: T): void;
    private targetKeyReport;
    private captureEvents;
    private installManiter;
    private reportManiter;
}

export { Maniter as default };
