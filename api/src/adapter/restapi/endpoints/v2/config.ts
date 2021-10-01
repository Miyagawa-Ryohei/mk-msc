import {EndpointBase} from "../../index";
import {Context} from "koa";


export default class Configuration extends EndpointBase{

    private endpoint :string
    constructor(endpoint? : string) {
        super(endpoint || "configuration")
        this.endpoint = endpoint || "configuration";
        this.getMethod = this.getConfiguration
    }

    public async getConfiguration(ctx : Context) : Promise<void>{
        console.log("found")
        ctx.response.status = 200
        ctx.response.message = "v2 config"
        return ;
    }
}