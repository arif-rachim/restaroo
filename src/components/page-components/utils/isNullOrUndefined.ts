/**
 * Check if text is empty text or null or undefined
 * @param text
 */
export function isNullOrUndefined(param: any) {
    if (param === undefined || param === null) {
        return true;
    }
    return false;
}