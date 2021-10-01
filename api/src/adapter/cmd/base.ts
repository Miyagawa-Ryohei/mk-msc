
import {CommandLineError} from "../../entity/errors/command_line_error";

type ParsingOptionType = "number" | "string" | "boolean"
type ParsedOptionType = number | string | boolean

type CommandLineParameterDefinition =  {
    [key : string] : {
        defaultValue? : ParsedOptionType,
        type : ParsingOptionType,
        require : boolean,
        description : string,
    }
}

type CommandLineParameter = {
    [flag : string] : {
        value? : ParsedOptionType
    }
}

type CommandLineFlagsDefinition = {
    [flag : string] : {
        description : ParsedOptionType
    }
}

type CommandLineFlags = string[]

export interface CommandDef {
    name : string
    usage? : string
    run? : (cmd : Command) => any
}

export class Command {

    private parent? : Command

    private subCommands: Array<Command>

    private _name : string

    private _usage : string

    private run? : (cmd : Command) => string

    private definedParam : CommandLineParameterDefinition

    private definedFlag : CommandLineFlagsDefinition

    private commandlineParameter : CommandLineParameter

    private commandlineFlags : CommandLineFlags

    constructor(cmdDefinition : CommandDef) {
        this._name = cmdDefinition.name;
        this._usage = cmdDefinition.usage || "";
        this.run = cmdDefinition.run;
        this.definedParam = {};
        this.definedFlag = {};
        this.commandlineParameter = {};
        this.commandlineFlags = [];
        this.subCommands = new Array<Command>()
    }

    get name(){
        return this._name
    }

    get usage(){
        return this._usage
    }

    private setParent(cmd : Command){
        this.parent = cmd
    }

    public getParams<T extends ParsedOptionType>(flag : string) : T {
        if(!(flag in this.commandlineParameter)) {
            throw new CommandLineError(`unknown parameter -${flag} `)
        } else {
            const value = this.commandlineParameter[flag].value;
            if(!value) {
                throw new CommandLineError(`undefined parameter -${flag} `)
            }
            return value as T;
        }
    }

    public getFlags(flag : string) : Partial<ParsedOptionType> {
        if(!(flag in this.commandlineFlags)) {
            throw new CommandLineError(`unknown parameter -${flag} `)
        } else {
            return this.commandlineFlags.includes(flag);
        }
    }

    public addParams(flag : string, type : ParsingOptionType, defaultValue? : ParsedOptionType, describe? : string, require? : boolean) : string {

        if(flag in this.definedParam){
            return `flag ${flag} is already exists`
        }

        const description = describe || ""
        if (!defaultValue) {
            this.definedParam[flag] = {
                type : type,
                require : !!require,
                description : description
            }
        } else if (typeof defaultValue === type) {
            this.definedParam[flag] = {
                defaultValue : defaultValue,
                type : type,
                require : !!require,
                description : description
            }
            this.commandlineParameter[flag] = {
                value : defaultValue
            }
        } else {
            return `default value has mismatch type. expect ${type}, but actual ${typeof defaultValue}`
        }
        return "";
    }

    public addFlags(flag : string, describe? : string) : string {
        this.definedFlag[flag] = {
            description : describe || ""
        }

        return "";
    }

    public append(sub : Command){
        sub.setParent(this)
        this.subCommands.push(sub);
    }

    private parseArgs(args : string[]) : string {

        console.log(this.definedParam);
        for(let i = 0; i < args.length; i ++){
            const arg = args[i]

            if(arg.startsWith("--")){
                const flag = arg.replace("--","")
                if(!this.commandlineFlags.includes(flag)){
                    this.commandlineFlags.push(flag)
                }
            }else if(arg.startsWith("-")){

                const flag = arg.replace("-","")
                if(!(flag in this.commandlineParameter)){
                    return `unknown flag ${flag}`
                }
                if(args.length <= i + 1){
                    return `parse error : not found ${flag}'s value`
                }
                if(args[i+1].startsWith("-")){
                    return `parse error : not found ${flag}'s value`
                }

                const valueSeed = args[i+1];
                var value : ParsedOptionType;

                switch(this.definedParam[flag].type) {
                    case "number":
                        value = parseInt(valueSeed);
                        break;
                    case "string":
                        value = valueSeed;
                        break;
                    case "boolean":
                        if (valueSeed === "true") {
                            value = true
                        } else if (valueSeed === "false") {
                            value = false
                        } else {
                            return `not parse ${valueSeed} to boolean value`;
                        }
                        break;
                }

                i++;

                this.commandlineParameter[flag] = {
                    value
                }

            }
        }

        return "";
    }

    private showUsage() {
        const requiredCommands = this.subCommands.map(c => [c.name, c.usage])
        console.log(`${this.name} usage [help]`)
        console.log(``)
        console.log(requiredCommands.map(rc => rc.join("\t\t\t")).join("\n"))
    }

    private showHelp () {
        var commandTree = "";
        var cmd : Command | undefined = this;

        while(cmd){
            commandTree = cmd.name + ` ${commandTree}`
            cmd = cmd.parent;
        }

        const params = [];
        for (let key in this.definedParam) {
            params.push(`\t-${key}\t${this.definedParam[key].type}[${this.definedParam[key].defaultValue}] \t: ${this.definedParam[key].description}`)
        }

        const flags = [];
        for (let key in this.definedFlag) {
            flags.push(`\t--${key}\t${this.definedFlag[key].description}`)
        }

        const subCommands = this.subCommands.map(c => [c.name, c.usage])

        console.log(`${commandTree} help`)
        console.log(``)
        if( this.subCommands.length > 0 ){
            console.log(subCommands.map(rc => rc.join("\t\t\t")).join("\n"))
        }
        console.log(`parameters`)
        console.log(params.join("\n"))
        console.log(`flags`)
        console.log(flags.join("\n"))

    }

    public exec(args : string[]){
        if(args.length > 0){
            if(args[0] === "help"){
                return this.showHelp()
            } else if (args[0].startsWith("-")){
                const err = this.parseArgs(args);
                throw new CommandLineError(err)
            } else {
                if (args.length > 0) {
                    const sub = args.shift();
                    const cmd = this.subCommands.filter(s => s.name === sub)
                    if(cmd.length > 0) {
                        cmd[0].exec(args)
                    }
                }
            }
        } else if(!this.run) {
            this.showUsage()
        } else {
            this.run(this)
        }
    }
}
