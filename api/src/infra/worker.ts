
import {WorkerStatus} from "../entity/status";
import {Process} from "../entity/process";
import {RequestProvider} from "../entity/provider";



export class Worker {
    private provider : RequestProvider
    private storage : Storage;
    private promisses : Promise<string>[];
    private status : WorkerStatus;
    private processMap : {
        [key : string] : Process[]
    }

    constructor (private p : RequestProvider, private s : Storage, opt : any /* todo : WorkerOptionを定義する */){
    }

    public add(p : Process) {
        this.processMap[p.path] = this.processMap[p.path].concat(p)
    }

    public exec() {
        return new Promise<void>(async (resolve, reject) => {
            try {
                while(true) {
                    if(this.status.running === "TERMINATING"){
                        this.status.running = "TERMINATED"
                        return(resolve())
                    }

                    const request = this.provider.getRequest();
                    const inputData = this.storage;


                }
            } catch (e) {
                this.status.running = "ERROR"
                reject(e)
            }
        })
    }

    public stop() {
        this.status.running = "TERMINATING"
    }
}


