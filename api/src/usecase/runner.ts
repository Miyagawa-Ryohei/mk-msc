import {Worker} from "../infra/worker"

export class RunnerUsecase {

    private close? : Function
    private workers : Worker[]

    constructor() {
        this.workers = [];
    }
    public exec() {
        this.workers.map(w => {
            w.exec();
        })
    }

    public addWorker(w : Worker) {
        this.workers = this.workers.concat(w);
    }

    public async restart() {
        try {
            await this.stop()
            await this.exec();
        } catch(e) {
            // エラーログをセットしとく
        }
    }

    public async stop() {
        const promises = this.workers.map(w => {
            w.stop();
        })
        try {
            await Promise.all(promises);
        } catch(e) {
            throw (e)
        }
    }
}