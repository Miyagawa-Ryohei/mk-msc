

export class CommandLineError extends Error {
    constructor(msg? : string) {
        super(`command line error has occured : ${msg? (`: ${msg}`) : ("")}`)
    }

}