import {isNullOrUndefined} from "./isNullOrUndefined";
import {isEmptyText} from "./isEmptyText";

/**
 * Tools to check if object is empty
 * @param object
 */
export function isEmptyObject(object: any) {
    if (isNullOrUndefined(object)) {
        return true;
    }
    return Object.keys(object).reduce((result, key) => {
        return isEmptyText(object[key]) && result;
    }, true)
}