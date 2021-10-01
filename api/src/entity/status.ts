
export type RunningStatus = "TERMINATED" | "RUNNING" | "TERMINATING" | "ERROR"

export type WorkerStatus = {
    id : string;
    running :RunningStatus;
    workerWeight : number;
    runningConfig : any /* todo WorkerConfigを定義する */;
    startedAt : Date;
    createdAt : Date;
}