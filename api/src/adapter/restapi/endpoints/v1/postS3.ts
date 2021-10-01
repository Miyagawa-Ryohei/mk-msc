import {EndpointBase} from "../../index";
import {Context} from "koa";
import multer from "@koa/multer"
import S3Driver from "../../../storage/s3";
const upload = multer();

export default class PostS3 extends EndpointBase{

    private endpoint :string

    constructor(endpoint? : string) {
        super(endpoint? endpoint : "upload")
        this.endpoint = endpoint || "upload";
        this.postPreFilter = upload.single('upload')
        this.getMethod = this.get.bind(this)
        this.postMethod = this.post.bind(this)
    }

    public async get(ctx : Context) : Promise<void>{
        const s3Driver = new S3Driver("")
        const list = (await s3Driver.listDeep(""))
        ctx.response.body = JSON.stringify(list);
        ctx.response.status = 200;
        return ;
    }

    public async post(ctx : any) : Promise<void>{
        const file : multer.File = ctx.file;
        if (!file) {
            const msg = `no file`
            ctx.response.status = 403
            ctx.response.message = msg
            return
        }
        const bucket = ctx.request.body.bucket;
        if(!bucket){
            const msg = `Bad Request`
            ctx.response.status = 403
            ctx.response.message = msg
            return
        }
        try {
            new Promise<boolean>(async (resolve, reject) => {
                try {
                    const s3Driver = new S3Driver(bucket)
                    await s3Driver.write(file.originalname, file.buffer);
                } catch (e) {
                    console.log("error has occured : " + e)
                }
            })
            ctx.redirect("/view")
        } catch (e) {
            console.log("error has occured : " + e)
            ctx.response.status = 500
            ctx.response.message = e.message
        }
        return ;
    }
}