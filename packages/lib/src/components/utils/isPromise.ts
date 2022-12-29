import {isFunction} from "./isFunction";
import {isNullOrUndefined} from "./isNullOrUndefined";

export function isPromise(param: any) {
    return (!isNullOrUndefined(param)) && typeof param === 'object' && isFunction(param.then);

}