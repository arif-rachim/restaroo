const http = require('http');
const otpHandler = require("./handlers/otp");
const port = process.env.REACT_APP_SERVICE_PORT;
const {homepage} = require('../package.json');

const MAPPER = {
    'otp': otpHandler
}

const server = http.createServer(async (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', homepage);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if(req.method === 'OPTIONS'){
        res.writeHead(200);
        res.end(JSON.stringify({status:'OK'}));
        return;
    }
    if(req.method === 'GET'){
        res.writeHead(200);
        res.end(JSON.stringify({status:'OK'}));
        return;
    }
    try {
        const pathMethod = req.url.split('/').filter(v => v).join('/');
        const handler = MAPPER[pathMethod];
        if(handler === undefined){
            throw new Error('Unable to find handler '+ pathMethod);
        }
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', async () => {
            const parameters = JSON.parse(body);
            const result = await handler(parameters);
            console.log(pathMethod,body,result);
            res.writeHead(200);
            res.end(JSON.stringify(result));
        });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(404);
        res.end(JSON.stringify({error:err.message,stack:err.stack}));
    }
});
server.listen(port);
console.log('Support service is running in port ', port)

function sendOtp(phone, otp) {

}