import path from "path";
import * as fs from "fs";
import {FileReadError} from "../../entity/errors/file_read_error";

export type FileList = string[]

export class LocalFileSystem {

    constructor(private root : string) {}

    private getAbsolutePath(target : string) : string{
        return path.join(this.root,target);
    }

    public exists(target : string) : boolean{
        const absolute = this.getAbsolutePath(target);
        try {
            return fs.existsSync(absolute)
        } catch (e) {
            console.log(e)
            return false
        }
    }

    public async isFile(target : string): Promise<boolean> {
        const absolute = this.getAbsolutePath(target);

        if (!this.exists(target)) {
            return false
        }
        return new Promise<boolean>((resolve, reject) => {
            fs.stat(absolute,(e,stat)=> {
                if(e) {
                    console.log(e)
                    reject(e)
                }
                resolve(stat.isFile())
            });
        })
    }

    public async read(target : string): Promise<Buffer>{
        const absolute = this.getAbsolutePath(target);
        console.log(`read ${absolute}`)
        if(this.isFile(target)){
            return new Promise<Buffer>(((resolve, reject) => {
                fs.readFile(absolute,(e, data) => {
                    if(e){
                        console.log("error has occured : " + e)
                        reject(e)
                    }
                    resolve(data)
                })
            }))
        } else {
            console.log(`${target} is not file`);
            throw new FileReadError(`${target} is none or dir`)
        }
    }

    public async write(target : string, data : Buffer, option? : {}) : Promise<boolean>{
        const absolute = this.getAbsolutePath(target);
        if(this.exists(target)){
            console.log(`${target} is already exist`);
            throw new FileReadError(`${target} is exist. can not write file`)
        } else {
            return new Promise<boolean>(((resolve, reject) => {
                fs.writeFile(absolute,data, (e) => {
                    if(e) reject(e)
                    resolve(true)
                })
            }))
        }
    }


    public async listDeep (target : string) : Promise<FileList>{
        const absolute = this.getAbsolutePath(target);
        if(!await this.isFile(target)) {
            return await new Promise<FileList>((resolve, reject) => {
                fs.readdir(absolute,async (e, flist) => {
                    if(e){
                        console.log(e)
                        reject(e)
                    }
                    var files : FileList = []
                    for (let index in flist){
                        const f = flist[index]
                        const next = path.join(target, f)
                        try {
                            const nexts = await this.listDeep(next);
                            files = files.concat(nexts)
                        } catch(e) {
                            console.log(e)
                            resolve(e)
                        }
                    }
                    resolve(files)
                })
            })
        } else {
            return [target]
        }
    }
}
