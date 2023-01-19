import * as dotenv from 'dotenv';
import http, {OutgoingHttpHeaders, RequestOptions} from "http";
import {writeFile} from "fs/promises";

dotenv.config({path: '.env.local'});
const pbAdminAccount = process.env.POCKET_BASE_ADMIN_USERNAME;
const pbAdminPassword = process.env.POCKET_BASE_ADMIN_PASSWORD;
const pbPort = process.env.POCKET_BASE_PORT;

async function start(){
    const {token}:any = await fetch(`/api/admins/auth-with-password`,{},{identity:pbAdminAccount, password: pbAdminPassword});
    const collectionData:any = await fetch(`/api/collections?page=1&perPage=200&sort=%2Bcreated`,{'Authorization':token});
    await writeFile('src/tables.ts',`import {Table} from "./SchemaTypes";\nexport const tables:Table[] = ${JSON.stringify(collectionData.items,null,2)}`);
}
function fetch(url:string,header:OutgoingHttpHeaders,body?:any){
    return new Promise(resolve => {
        const options:RequestOptions = {method:'get',host:'localhost',port:pbPort,path:url,headers:header}
        if(body){
            options.method = 'post';
            options.headers = {'Content-Type':'application/json',...header};
        }
        const request = http.request(options,res => {
            let data = [];
            res.on('data', chunk => {
                data.push(chunk);
            });
            res.on('end', () => {
                const result = JSON.parse(Buffer.concat(data).toString());
                resolve(result);
            });
        }).on('error', err => {
            console.log('Error: ', err.message);
        });
        if(body){
            request.write(JSON.stringify(body));
        }
        request.end();
    })

}
start().then();
