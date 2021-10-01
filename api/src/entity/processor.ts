

export interface Processor{
    exec(src : string, dist: string) : Promise<string>
    exec(src : Buffer, dist: string) : Promise<string>
}