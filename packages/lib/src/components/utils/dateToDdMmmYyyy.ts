import {isNullOrUndefined} from "./isNullOrUndefined";
import invariant from "tiny-invariant";
import {dateToHhMm} from "./dateToHhMm";

const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function dateToDdMmmYyyy(date?: Date) {
    if (isNullOrUndefined(date)) {
        return '';
    }
    invariant(date);
    const pad = (val: number) => val.toString().padStart(2, '0');
    return `${pad(date.getDate())} ${month[date.getMonth()]} ${date.getFullYear()}`
}

export function dateToDdMmmYyyyHhMm(date?: Date) {
    return `${dateToDdMmmYyyy(date)} ${dateToHhMm(date)}`;
}

export function dateToDdMmm(date?: Date) {
    if (isNullOrUndefined(date)) {
        return '';
    }
    invariant(date);
    const pad = (val: number) => val.toString().padStart(2, '0');
    return `${pad(date.getDate())} ${month[date.getMonth()]}`
}

export function dateToDdd(date?: Date) {
    if (isNullOrUndefined(date)) {
        return '';
    }
    invariant(date);
    return dayOfWeek[date.getDay()]
}
