import {ServerUsecase} from "./server";
import {Route} from "../infra/router";
import {RunnerUsecase} from "./runner";
import {Worker} from "../infra/worker"


export class Application {

    constructor(private service :ServerUsecase, private runner :RunnerUsecase){}

    startServer(rs : Route[],port : number) {
        for(let r of rs){
            this.service.setRoute(r)
        }
        this.service.exec(port);
    }

    stopServer() {
        this.service.stop();
    }

    restartServer(rs : Route[]) {
        this.stopServer();
        this.startServer(rs,8080);
    }

    startWorker(ws : Worker[]){
        for (let w of ws){
            this.runner.addWorker(w);
        }
        this.runner.exec()
    }


}