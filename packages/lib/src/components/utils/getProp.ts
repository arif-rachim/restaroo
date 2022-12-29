import {isNullOrUndefined} from "./isNullOrUndefined";

export function getProp(param: any, ...props: string[]): any {
    let value: any = param;

    for (const prop of props) {
        if (isNullOrUndefined(value)) {
            //console.trace('Value is undefined or null ', value);
            return undefined;
        }
        if (!(prop in value)) {
            //console.trace('There is no ', prop, ' in ', value);
            return undefined;
        }
        if (isNullOrUndefined(value[prop])) {
            return value[prop]
        }
        try {
            value = value[prop];
        } catch (err) {
            console.trace(err);
            return undefined;
        }
        return value;
    }
}