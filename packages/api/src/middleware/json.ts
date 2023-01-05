import {Middleware} from "./Middleware";
import {otpHandler} from "../handlers/otp";
import {Handler} from "../handlers/Handler";

const MAPPER = {
    'otp': otpHandler
}

export const json: Middleware = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    try {
        const pathMethod = req.url.split('/').filter(v => v).join('/');
        const handler: Handler = MAPPER[pathMethod];
        if (handler === undefined) {
            throw new Error('Unable to find handler ' + pathMethod);
        }
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
            const parameters: any = JSON.parse(body);
            const result = await (() => new Promise((resolve) => {
                handler(parameters, resolve)
            }))();
            console.log(pathMethod, body, result);
            res.writeHead(200);
            res.end(JSON.stringify(result));
        });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(404);
        res.end(JSON.stringify({error: err.message, stack: err.stack}));
    }
    next(true);
}
