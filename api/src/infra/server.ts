
import Koa from "koa"
import {Route} from "./router";
import config from "config";
import path from "path";
import mount from "koa-mount";
import serve from "koa-static"

const serverConfig = config.util.loadFileConfigs(path.join(__dirname,"..","..","config","server"))
const storageConfig = config.util.loadFileConfigs(path.join(__dirname,"..","..","config","storage"))

export class Server {
    private server : Koa
    private router : Route | undefined
    private static _instance : Server | null = null
    private close = () => {
        // warningログを表示させる
    }

    constructor() {
        this.server = new Koa()
    }

    public setMiddleWare() {
        this.server.use(mount("/static", serve(serverConfig.server.contents_root+"/static")) )
        this.server.use(mount("/", serve(serverConfig.server.contents_root)) )
    }

    public setRoute(r: Route){
        console.log("set route")
        this.server.use(r.router.routes()).use(r.router.allowedMethods());
    }

    public start(port : number) : Function {
        // portやその他設定をよみこめるように
        console.log(`listen on port ${port}`)
        const s = this.server.listen(port);
        s.close.bind(s);
        this.close = s.close
        return this.close;
    }

    static _getInstance() : Server {
        if(!this._instance) {
            this._instance = new Server()
        }
        return this._instance
    }
}



