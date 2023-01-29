import {useTable} from "./useTable";
import {Store, useAppDimension, useStoreValue} from "@restaroo/lib";
import {Config} from "./grid/Grid";
//
// export const scrollerWidth = 15;
// export const checkboxColumnWidth = 32;
// export const deleteColumnWidth = 25;
// export const editColumnWidth = 25;
// export const viewColumnWidth = 25;

export function useAverageColumnWidth(collection: string, configStore: Store<Config>) {
    const table = useTable(collection);
    const {appDimension} = useAppDimension();
    const showSelectionColumn = useStoreValue(configStore, s => s.maximumSelection > 0);
    const showEditColumn = useStoreValue(configStore, s => s.permission.edit);
    const showDeleteColumn = useStoreValue(configStore, s => s.permission.delete);
    const showViewColumn = useStoreValue(configStore, s => s.permission.view);
    const scroller = 15;
    const select = showSelectionColumn ? 32 : 0;
    const edit = showEditColumn || showViewColumn ? 25 : 0
    const delete_ = showDeleteColumn ? 25 : 0
    const view = showViewColumn ? 25 : 0;
    const standard = (appDimension.width - (scroller + select + (showEditColumn || showViewColumn ? edit : 0) + delete_ )) / table.schema.length;
    return {
        edit,
        view,
        del:delete_,
        select,
        standard,
        scroller
    }
}