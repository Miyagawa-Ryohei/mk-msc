

export class TimeoutError extends Error {
    constructor(msg? : string) {
        super(`timeout has occured ${msg? (`: ${msg}`) : ("")}`)
    }

}