import {Readable, Writable} from "stream";
import * as CP from 'child_process';

export interface CommandParameters {
    [key : string] : string
}

export type CommandArgument = string | string[]

export class CommandLiner {
    private _mainCommand : string;
    private _parameter : CommandParameters;
    private _arguments : string[];
    private _output : Writable;
    private _input : Readable;

    constructor() {
        this._mainCommand = ""
        this._parameter = {}
        this._arguments = []
        this._input = process.stdin;
        this._output = process.stdout;
    }

    set mainCommand(cmd : string){
        this._mainCommand = cmd
    }

    set input(src : Readable) {
        this._input = src
    }

    set output(dist : Writable) {
        this._output = dist
    }

    public addParams(params : CommandParameters) {
        this._parameter = {
            ...this._parameter,
            ...params
        }
    }

    public addArguments(arg : CommandArgument) {
        this._arguments = this._arguments.concat(arg);
    }

    public async exec (){
        var params = "";
        for (let param in this._parameter){
            var params = params + ` ${param} ${this._parameter[param]}`
        }
        var argParts = this._arguments.length > 0 ? (" " + this._arguments.join(" ")) : "";
        const cmd = `${this._mainCommand}${params}${argParts}`
        console.log(cmd)
        return new Promise<any>((resolve, reject) =>{
            var cp = CP.exec(cmd,(error => {
                console.log(error)
                reject(error)
            }));
            cp.stdout!.on("data",(chunk) => {
                console.log(chunk)
                // this._output.write(chunk);
            })
            cp.stdout!.on("end",() => {
                // this._output.end();
                resolve(null)
            })
            cp.stderr!.on("error", (err) => {
                console.log(err)
                reject(err)
            })
        })

    }


}