import {NotImprementedError} from "../../../../entity/errors/not_implemented";
import {EndpointBase} from "../../index";
import {Context} from "koa";


export default class Worker extends EndpointBase{

    private endpoint :string
    constructor(endpoint? : string) {
        super(endpoint || "worker")
        this.endpoint = endpoint || "worker";
        this.getMethod = this.getConfiguration
    }

    public async getConfiguration(ctx : Context) : Promise<void>{
        console.log("found")
        ctx.response.status = 200
        ctx.response.message = "v1 worker"
        return ;
    }
}

