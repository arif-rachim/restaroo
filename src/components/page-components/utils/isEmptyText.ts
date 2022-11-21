/**
 * Check if text is empty text or null or undefined
 * @param text
 */
import {isNullOrUndefined} from "./isNullOrUndefined";

export function isEmptyText(text: any) {
    if (isNullOrUndefined(text)) {
        return true;
    }
    if (typeof text === 'string') {
        if (text === '') {
            return true;
        }
        if (text.trim() === '') {
            return true;
        }
        return false;
    }
    return true;
}