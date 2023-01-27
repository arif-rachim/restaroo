import {useTable} from "./useTable";
import {useAppDimension} from "@restaroo/lib";

export const scrollerWidth = 15;
export const checkboxColumnWidth = 32;
export const manageColumnWidth = 50;

export function useAverageColumnWidth(collection: string) {
    const table = useTable(collection);
    const {appDimension} = useAppDimension();
    return (appDimension.width - (scrollerWidth + checkboxColumnWidth + manageColumnWidth)) / table.schema.length;
}