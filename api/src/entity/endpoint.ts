import * as Koa from "koa";


export type GetMethod = (...arg : any[]) => Promise<void>;
export type PostMethod = (...arg : any[]) => Promise<void>;
export type PutMethod = (...arg : any[]) => Promise<void>;
export type DeleteMethod = (...arg : any[]) => Promise<void>;

export interface EndPoint{
    path : string,
    getMethod : GetMethod,
    postMethod : PostMethod,
    putMethod : PutMethod,
    deleteMethod : DeleteMethod,

    postPreFilter : Koa.Middleware
    getPreFilter : Koa.Middleware
    putPreFilter : Koa.Middleware
    deletePreFilter : Koa.Middleware
}