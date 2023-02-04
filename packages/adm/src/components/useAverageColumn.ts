import {useTable} from "./useTable";
import {Store, useAppDimension, useStoreValue} from "@restaroo/lib";
import {CollectionRoute} from "./collection-list/Grid";
import {RouteConfig} from "./useRouteConfig";

export function useAverageColumnWidth(collection: string, configStore: Store<RouteConfig<CollectionRoute>>) {
    const table = useTable(collection);
    const {appDimension} = useAppDimension();
    const showSelectionColumn = useStoreValue(configStore, s => s.data.maximumSelection > 0);
    const showEditColumn = useStoreValue(configStore, s => s.data.permission.edit);
    const showDeleteColumn = useStoreValue(configStore, s => s.data.permission.delete);
    const showViewColumn = useStoreValue(configStore, s => s.data.permission.view);
    const scroller = 15;
    const select = showSelectionColumn ? 32 : 0;
    const edit = showEditColumn || showViewColumn ? 25 : 0
    const delete_ = showDeleteColumn ? 25 : 0
    const view = showViewColumn ? 25 : 0;
    const standard = (appDimension.width - (scroller + select + (showEditColumn || showViewColumn ? edit : 0) + delete_)) / table.schema.length;
    return {
        edit,
        view,
        del: delete_,
        select,
        standard,
        scroller
    }
}