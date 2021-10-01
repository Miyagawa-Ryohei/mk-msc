
import Koa from "koa"
import Router from "koa-router";
import {EndPoint} from "../entity/endpoint";
import {TimeoutError} from "../entity/errors/timeout";

export class WorkerController {
    private promisses : Promise<string>[]
    private worker : {
        [key : string] : {
            processor : Worker
        }[]
    }

    constructor (private p : RequestProvider, private s : Storage, opt : WorkerOption){
        this.promisses = [];
    }

    public add(p : Worker) {
        this.processors[p.path] = this.processors[p.path].concat({
            processor: p
        })
    }

    public exec() {
        return new Promise<void>(async (resolve, reject) => {
            try {
                while(true) {
                    if("TERMINATING") return(resolve());
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    public stop() {
        for(let path of this.processors) {
            for(let processor of this.processors[path]){
                processor.stop();
            }
        }
        return new Promise<void>(async (resolve, reject) => {
            const timeout = setTimeout(()=> {
                return reject(new TimeoutError("cannot stop any processors"))
            },60000)
            try {
                await Promise.all(this.promisses);
                clearTimeout(timeout);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
}


