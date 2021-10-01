import {EndpointBase} from "../../index";
import {Context} from "koa";
import {CONF} from "../../../../infra/config";


export default class Configuration extends EndpointBase{

    private endpoint :string
    constructor(endpoint? : string) {
        super(endpoint? endpoint : "config")
        this.endpoint = endpoint || "config";
        this.getMethod = this.getConfiguration
    }

    public async getConfiguration(ctx : Context) : Promise<void>{
        const name = ctx.request.query["name"];
        var bodyJson: {[key : string] : any } = {}
        if(!name) {
            bodyJson = CONF
        } else {
            if(typeof name === "string"){
                bodyJson[name] = CONF[name] || {}
            } else {
                name.map((v:string) => {
                    bodyJson[v] = CONF[v] || {};
                })
            }
        }
        ctx.response.body=JSON.stringify(bodyJson)
        ctx.response.status = 200
        ctx.response.message = "ok"
        return ;
    }
}