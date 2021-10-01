import config from "config";
import path from "path";

export const CONF : {[key : string] : any} = {
    driver : config.util.loadFileConfigs(path.join(__dirname,"..","..","config","driver")),
    worker : config.util.loadFileConfigs(path.join(__dirname,"..","..","config","worker")),
    server : config.util.loadFileConfigs(path.join(__dirname,"..","..","config","server")),
    storage: config.util.loadFileConfigs(path.join(__dirname,"..","..","config","storage")),
}
