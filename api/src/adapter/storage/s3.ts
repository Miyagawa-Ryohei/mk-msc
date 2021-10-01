import * as aws from "aws-sdk"
import {S3} from "aws-sdk"
import path from "path";
import {FileReadError} from "../../entity/errors/file_read_error";
import {NotImprementedError} from "../../entity/errors/not_implemented";
import {CONF} from "../../infra/config";
import {ListBucketsOutput, ListObjectsOutput} from "aws-sdk/clients/s3";


export default class S3Driver {

    constructor(private root : string) {}

    private getS3Instance() {
        const option : S3.Types.ClientConfiguration = {
            region : CONF.driver.s3.region,
            apiVersion:"2006-03-01",
            endpoint : CONF.driver.s3.endpoint,
            signatureVersion: 'v4',
            s3ForcePathStyle: true,
            credentials : {
                accessKeyId : CONF.driver.s3.access_key,
                secretAccessKey : CONF.driver.s3.secret,
            }
        }
        console.log(option)
        return new aws.S3(option)
    }

    private getAbsolutePath(target : string) : string{
        return path.join(this.root,target);
    }

    public exists(target : string) : boolean{
        throw new NotImprementedError()
    }

    public async isFile(target : string): Promise<boolean> {
        throw new NotImprementedError()
    }

    public async read(target : string): Promise<Buffer>{
        const s3 = this.getS3Instance();
        try {
            const f = await s3.getObject({
                Bucket : this.root,
                Key : target
            }).promise()
            return f.Body as Buffer
        } catch (e){
            throw new FileReadError(e)
        }
    }

    public async write(target : string, data : Buffer, option? : {}) : Promise<boolean>{
        const s3 = this.getS3Instance();
        console.log(`upload size is ${data.length}`)
        console.log(`upload name is ${target}`)
        try {
            await new Promise<void>((resolve,reject) => {
                s3.putObject({
                    Body : data,
                    Bucket : this.root,
                    Key : target
                },(err) => {
                    if(!err) resolve()
                    else reject(err);
                });
            })
        } catch (e){
            console.log("error has occured")
            console.log(JSON.stringify(e,null,2))
            return false
        }
        return true
    }


    public async listDeep (target : string) : Promise<string[]>{
        const s3 = this.getS3Instance();
        var ret :string[] = [];
        var list : ListBucketsOutput | ListObjectsOutput = {};
        if(this.root === "" && target === "")  list = await s3.listBuckets().promise();
        else if (this.root === "") list = await s3.listObjects({
            Bucket : target,
        }).promise()
        else if (target === "") list = await s3.listObjects({
            Bucket : this.root
        }).promise()
        else list = await s3.listObjects({
            Bucket : this.root,
            Prefix : target
        }).promise()
        if("Buckets" in list){
            list.Buckets?.map((b,i) => {
                ret.push(b.Name || "");
            })
        } else {
            (list as ListObjectsOutput).Contents!.map((c,i) => {
                ret.push(c.Key || "");
            })
        }
        return ret
    }

}