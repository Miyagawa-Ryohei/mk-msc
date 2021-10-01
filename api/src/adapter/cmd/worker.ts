import {Command, CommandDef} from "./base";

export const workerDef : CommandDef = {
    name : "worker",
}

export const workerCmd = new Command(workerDef)