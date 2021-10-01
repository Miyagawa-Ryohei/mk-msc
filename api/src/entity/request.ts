
export type RequestContents = {
    inputData : ArrayBuffer // result of reading Request.requestFilePath
    configFilePath? : string
    fileKey : string
    outputChannel : string // in the requestFile
    nextChannel : string // defined by Process
    before : string // in the requestFile
}

export type RequestMetadata = {
    [key : string] : string,
    requestID : string,
    deleteID : string,
}

export class Request {
    private requestPath : string;
    constructor(
        private _meta : RequestMetadata,
        private _action : string,
        private _requestFilePath : string,
        private _contents : RequestContents,
        private _raw : any,
        private _done : () => {}
    ) {}

    get meta() {
        return this._meta
    }

    get action() {
        return this._action
    }

    get requestFilePath() {
        return this._requestFilePath
    }

    get contents() {
        return this._contents
    }

    get raw() {
        return this._raw
    }
}