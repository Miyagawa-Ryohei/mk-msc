import {Server} from "../infra/server";
import {Route} from "../infra/router";


export class ServerUsecase {

    private close? : Function
    public exec(port : number) {
        const s = Server._getInstance();
        s.setMiddleWare();
        this.close = s.start(port)
    }

    public setRoute(r : Route) {
        const s = Server._getInstance()
        s.setRoute(r)
    }

    public async stop() {
        if(this.close) {
            await this.close()
        }
    }
}