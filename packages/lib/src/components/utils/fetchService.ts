export type FetchService = (method:string,param:unknown) => Promise<any>

export function createFetch(url: string):FetchService {
    return async function fetchService(method: string, param: any) {
        const path = method.split('/').filter(v => v).join('/').toLowerCase();
        const result = await fetch(`${url}/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
        });
        const message = await result.json();
        if (message.error) {
            console.error(message);
        }
        return message;
    }
}
