import {useAppStore} from "@restaroo/lib";
import {AppState} from "../index";
import {Table} from "@restaroo/mdl";
import {useMemo} from "react";
import {EMPTY_TABLE} from "./grid/Grid";

export function useTable(collection: string) {
    const store = useAppStore<AppState>();
    const table: Table = useMemo(() => store.get().tables.find(t => t.name === collection) ?? EMPTY_TABLE, [collection]);
    return table;
}