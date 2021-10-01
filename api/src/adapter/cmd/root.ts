import {Command, CommandDef} from "./base";

const rootCmdDef : CommandDef = {
    name : "mkmsc",
    run : ((cmd : Command) : string => {
        return "";
    })
}

export const rootCmd = new Command(rootCmdDef);

