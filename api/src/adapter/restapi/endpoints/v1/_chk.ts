import {EndpointBase} from "../../index";
import {Context} from "koa";


export default class Configuration extends EndpointBase{

    private endpoint :string
    constructor(endpoint? : string) {
        super(endpoint? endpoint : "_chk")
        this.endpoint = endpoint || "_chk";
        this.getMethod = this.healthCheck
    }

    public async healthCheck(ctx : Context) : Promise<void>{
        ctx.response.status = 200
        ctx.response.message = "ok"
        return ;
    }
}