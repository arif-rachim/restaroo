
export function dateToHhMm(date?: Date) {
    if (!date) {
        return '';
    }
    const pad = (val: number) => val.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}