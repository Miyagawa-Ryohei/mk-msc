import {Command, CommandDef} from "./base";
import {rootCmd} from "./root";
import config from "config"
import {CONF} from "../../infra/config";


export const configDef : CommandDef = {
    name : "config",
}

export const configShowDef : CommandDef = {
    name : "show",
    usage : "show current config",
    run : async (cmd : Command) => {
        console.log("show")
        const name = cmd.getParams<string>("n")

        if(name === "all"){
            console.log(JSON.stringify(CONF || {}, null, 2))
        } else {
            console.log(JSON.stringify(CONF[name] || {}, null, 2))
        }
    }
}

export const configCmd = new Command(configDef)
export const configShowCmd = new Command(configShowDef);

configCmd.append(configShowCmd);
rootCmd.append(configCmd)

configShowCmd.addParams("n","string","all","config category name",false)
