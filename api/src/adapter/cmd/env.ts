import {Command, CommandDef} from "./base";
import {rootCmd} from "./root";


export const envDef : CommandDef = {
    name : "env",
}

export const envShowDef : CommandDef = {
    name : "show",
    usage : "show current environments variable",
    run : async (cmd : Command) => {
        console.log(cmd.usage);
        console.log(process.env)
    }
}

export const envCmd = new Command(envDef)
export const envShowCmd = new Command(envShowDef);

envCmd.append(envShowCmd);
rootCmd.append(envCmd)

