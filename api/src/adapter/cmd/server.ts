import {Command, CommandDef} from "./base";
import {rootCmd} from "./root";
import {Application} from "../../usecase/application";
import {ServerUsecase} from "../../usecase/server";
import {RunnerUsecase} from "../../usecase/runner";
import {Route} from "../../infra/router";
import config from "config"
import path from "path";
import {EndPoint} from "../../entity/endpoint";
import {LocalFileSystem} from "../storage/localfs";

const serverConfig = config.util.loadFileConfigs(path.join(__dirname,"..","..","..","config","server"))
const storageConfig = config.util.loadFileConfigs(path.join(__dirname,"..","..","..","config","storage"))

export const serverCmdDef : CommandDef = {
    name : "server",
    run : async (cmd : Command) => {
        const versions = serverConfig.endpoint.api_versions;
        const routes : Array<Route> = await Promise.all(versions.map(async (version :string )=> {
            const route = new Route(version);
            try{
                (await getEndpoints(version)).map(ep => {
                    route.add(ep);
                });
                return route
            } catch (e) {
                throw(e)
            }
        }))
        const port = cmd.getParams<number>("p");
        const server = new ServerUsecase();
        const runner = new RunnerUsecase();
        const application = new Application(server, runner);
        application.startServer(routes,port);
        return "";
    }
}

export const serverCmd = new Command(serverCmdDef);

serverCmd.addParams("p","number",8080,"port number for server")
serverCmd.addFlags("debug","debug mode")
rootCmd.append(serverCmd);

const getEndpoints = async (version : string) : Promise<Array<EndPoint>> => {
    const endpoints : Array<EndPoint> = new Array<EndPoint>()
    const localfs = new LocalFileSystem(path.join(storageConfig.localfs.endpoint_path))
    try {
        const apiSrc = await localfs.listDeep(path.join( "endpoints", version))
        const paths = apiSrc.map(s => path.relative(__dirname, path.join(storageConfig.localfs.endpoint_path, s)))
        paths.map(p => {
            const ep  = require(p).default;
            endpoints.push(new ep());
        })
        return endpoints
    } catch (e) {
        throw (e)
    }
}

