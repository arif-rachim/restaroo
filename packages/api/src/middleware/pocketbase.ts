import {Middleware} from "./Middleware";

const http = require("http");

const pocketBasePort = parseInt(process.env.POCKET_BASE_PORT);

export const pocketBase: Middleware = (req, res, next) => {
    const pathMethod = req.url.split('/').filter(v => v).join('/');
    const isForPocketBase = pathMethod.startsWith('_') || pathMethod.startsWith('api');
    if (isForPocketBase) {
        const request = http.request({
            method: req.method,
            headers: req.headers,
            host: '127.0.0.1',
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
