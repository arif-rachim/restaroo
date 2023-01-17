import * as dotenv from 'dotenv';
import http, {OutgoingHttpHeaders, RequestOptions} from "http";
import {writeFile} from "fs/promises";

dotenv.config({path: '.env.local'});
const pbAdminAccount = process.env.POCKET_BASE_ADMIN_USERNAME;
const pbAdminPassword = process.env.POCKET_BASE_ADMIN_PASSWORD;

async function schema(){
    const {token}:any = await fetch(`/api/admins/auth-with-password`,{},{identity:pbAdminAccount, password: pbAdminPassword});
    const collectionData:any = await fetch(`/api/collections?page=1&perPage=200&sort=%2Bcreated`,{'Authorization':token});
    await writeFile('schema.json',JSON.stringify(collectionData.items,null,2));
    console.log('COMPLETE COMRADE');
}
function fetch(url:string,header:OutgoingHttpHeaders,body?:any){
    return new Promise(resolve => {
        const options:RequestOptions = {method:'get',host:'localhost',port:8090,path:url,headers:header}
        if(body){
            options.method = 'post';
            options.headers = {'Content-Type':'application/json',...header};
        }
        const request = http.request(options,res => {
            let data = [];
            const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
            console.log('Status Code:', res.statusCode);
            console.log('Date in Response header:', headerDate);

            res.on('data', chunk => {
                data.push(chunk);
            });

            res.on('end', () => {
                console.log('Response ended: ');
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
schema().then();
