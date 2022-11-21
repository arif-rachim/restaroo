import {isNullOrUndefined} from "./isNullOrUndefined";
import invariant from "tiny-invariant";

const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function dateToDdMmmYyyy(date?: Date) {
    if (isNullOrUndefined(date)) {
        return '';
    }
    invariant(date);
    const pad = (val: number) => val.toString().padStart(2, '0');
    return `${pad(date.getDate())}-${month[date.getMonth()]}-${date.getFullYear()}`
}