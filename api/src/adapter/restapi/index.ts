import {NotImprementedError} from "../../entity/errors/not_implemented";
import {DeleteMethod, EndPoint, GetMethod, PostMethod, PutMethod} from "../../entity/endpoint";
import {Context} from "koa";
import * as Koa from "koa";


export class EndpointBase implements EndPoint{

    private _path : string

    constructor(path : string){
        this._path = path
    }

    private _get : GetMethod = async(ctx : Context) => {
        throw new NotImprementedError()
    }
    private _post : PostMethod = async(ctx : Context) => {
        throw new NotImprementedError()
    }
    private _put : PutMethod = async(ctx : Context) => {
        throw new NotImprementedError()
    }
    private _delete : DeleteMethod = async(ctx : Context) => {
        throw new NotImprementedError()
    }

    private _postPreFilter : Koa.Middleware = async (ctx : Context) : Promise<any> => {
        return
    }
    private _getPreFilter : Koa.Middleware = async(ctx : Context) => {
        return
    }
    private _putPreFilter : Koa.Middleware = async(ctx : Context) => {
        return
    }
    private _deletePreFilter : Koa.Middleware = async(ctx : Context) => {
        return
    }

    get getPreFilter(){ return this._getPreFilter}
    get putPreFilter(){ return this._putPreFilter}
    get postPreFilter(){ return this._postPreFilter}
    get deletePreFilter(){ return this._deletePreFilter}
    set getPreFilter(m : Koa.Middleware){ this._getPreFilter = m }
    set putPreFilter(m : Koa.Middleware){ this._putPreFilter = m }
    set postPreFilter(m : Koa.Middleware){ this._postPreFilter = m }
    set deletePreFilter(m : Koa.Middleware){ this._deletePreFilter = m }

    get path(){
        return this._path
    }

    get getMethod(){
        return this._get
    }
    get postMethod(){
        return this._post
    }
    get putMethod(){
        return this._put
    }
    get deleteMethod(){
        return this._delete
    }

    set getMethod(m : GetMethod){
        this._get = m
    }
    set postMethod(m : PostMethod){
        this._post = m
    }
    set putMethod(m : PutMethod){
        this._put = m
    }
    set deleteMethod(m : DeleteMethod){
        this._delete= m
    }

}