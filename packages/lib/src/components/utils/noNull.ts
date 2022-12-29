/**
 * Solution for avoiding null coalescing operator
 */
export default function noNull<T>(val: T | undefined | null, otherwise: T): T {
    return val === null || val === undefined ? otherwise : val;
}