const SERVICE_ADDRESS = process.env.REACT_APP_SERVICE_ADDRESS;
const SERVICE_PORT = process.env.REACT_APP_SERVICE_PORT;
export async function fetchService(method:string,param:any){
    const cleanMethod = method.split('/').filter(v => v).join('/').toLowerCase();
    const result = await fetch(`${SERVICE_ADDRESS}:${SERVICE_PORT}/${cleanMethod}`,{
        method:'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(param)
    });
    const message = await result.json();
    if (message.error) {
        console.error(message);
    }
    return message;
}