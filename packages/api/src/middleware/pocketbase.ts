import {Middleware} from "./Middleware";
import * as dotenv from "dotenv";

const http = require("http");
dotenv.config({path: '.env.local'});
const pocketBasePort = parseInt(process.env.POCKET_BASE_PORT);

export const pocketBase: Middleware = (req, res, next) => {
    const pathMethod = req.url.split('/').filter(v => v).join('/');
    const isForPocketBase = pathMethod.startsWith('_') || pathMethod.startsWith('api');
    if (isForPocketBase) {
        const request = http.request({
            method: req.method,
            headers: req.headers,
            host: 'localhost',
            port: pocketBasePort,
            path: req.url
        }, response => {
            response.on('data', data => res.write(data, 'binary'));
            response.on('end', data => res.end());
            response.on('error', data => console.error(data));
            res.writeHead(response.statusCode, response.headers);
        })
        req.on('data', data => request.write(data, 'binary'));
        req.on('end', () => request.end());
        return next(false);
    }
    return next(true);
}
