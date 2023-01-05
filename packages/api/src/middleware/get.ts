import {Middleware} from "./Middleware";

export const get: Middleware = (req, res, next) => {
    if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.writeHead(200);
        res.end(JSON.stringify({status: 'OK'}));
        return next(false);
    }
    next(true);
}