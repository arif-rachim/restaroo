
export function dateToHhMm(date?: Date) {
    if (!date) {
        return '';
    }
    const pad = (val: number) => val.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function hhMmToDate(hhMm?:string){
    if (!hhMm) {
        return undefined;
    }
    const [hour,minute] = hhMm.split(':');
    const today = new Date();
    return new Date(today.getFullYear(),today.getMonth(),today.getDate(),parseInt(hour),parseInt(minute),0,0);
}