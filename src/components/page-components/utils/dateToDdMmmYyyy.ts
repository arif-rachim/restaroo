const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export function dateToDdMmmYyyy(date?:Date){
    if(!date){
        return '';
    }
    const pad = (val:number) => val.toString().padStart(2,'0');
    return `${pad(date.getDate())}-${month[date.getMonth()]}-${date.getFullYear()}`
}