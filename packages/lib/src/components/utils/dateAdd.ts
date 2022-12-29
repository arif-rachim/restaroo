/**
 * Function to perform date calculation
 * @param date
 */
export function dateAdd(date: Date) {
    function calculate(type: string, value: number) {
        let year = date.getFullYear() + (type === "YEAR" ? value : 0);
        let month = date.getMonth() + (type === "MONTH" ? value : 0);
        let dateOfMonth = date.getDate() + (type === "DATE" ? value : 0);
        let hour = date.getHours() + (type === "HOUR" ? value : 0);
        let minute = date.getMinutes() + (type === "MINUTE" ? value : 0);
        let seconds = date.getSeconds() + (type === "SECOND" ? value : 0);
        return new Date(year, month, dateOfMonth, hour, minute, seconds, 0);
    }

    return {
        year: (val: number) => calculate("YEAR", val),
        month: (val: number) => calculate("MONTH", val),
        date: (val: number) => calculate("DATE", val),
        hour: (val: number) => calculate("HOUR", val),
        minute: (val: number) => calculate("MINUTE", val),
        second: (val: number) => calculate("SECOND", val),
    };
}