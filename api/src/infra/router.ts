
import Router from "koa-router";
import {EndPoint} from "../entity/endpoint";
import path from "path";

export class Route {
    private _router : Router

    constructor (version? : string){
        const v = version? `/${version}` : ""
        console.log(`/api${v}`)
        this._router=new Router<null,{}>({
            prefix : path.join(`/api${v}`)
        })
    }

    public add(endpoint : EndPoint) {

        this._router.get(`/${endpoint.path}`, endpoint.getMethod)
        endpoint.postPreFilter ? this._router.post(`/${endpoint.path}`, endpoint.postPreFilter, endpoint.postMethod) : this._router.post(`/${endpoint.path}`, endpoint.postMethod)
        this._router.put(`/${endpoint.path}`, endpoint.putMethod)
        this._router.delete(`/${endpoint.path}`, endpoint.deleteMethod)
    }

    get router() : Router{
        return this._router
    }
}


