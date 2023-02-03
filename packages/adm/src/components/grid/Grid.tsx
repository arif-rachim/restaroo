import {Table} from "@restaroo/mdl";
import {BaseModel, ListResult, RouteProps, useAppContext, useAsyncEffect, useStore} from "@restaroo/lib";
import {useCallback, useEffect, useId} from "react";
import {GridFooter} from "./GridFooter";
import {GridBody} from "./GridBody";
import {GridHeader} from "./GridHeader";
import {GridToolbar} from "./GridToolbar";


export const EMPTY_TABLE: Table = {
    schema: [],
    name: '',
    id: '',
    created: '',
    createRule: '',
    deleteRule: '',
    options: {},
    system: false,
    type: 'base',
    updated: '',
    listRule: '',
    updateRule: '',
    viewRule: ''
}

export const border = '1px solid rgba(0,0,0,0.1)';

export interface RouteConfig<Config> {
    id: string,
    path: string,
    data: Config
}

export interface ConfigColumn {
    schemaId: string,
    label: string,
    visible: boolean,
    minWidth: number,
    widthPercentage: number
}

export interface GridConfig {
    maximumSelection: number,
    columns: ConfigColumn[],
    permission: {
        edit: boolean,
        delete: boolean,
        create: boolean,
        view: boolean
    }
}

export function Grid(props: { route: RouteProps }) {
    const {route} = props;
    const collection = route.params.get('collection') ?? '';

    const {gridConfigStore, saveGridConfig} = useRouteConfig({route,ignoredParams:[]});
    const {pb} = useAppContext();

    const collectionStore = useStore<ListResult<BaseModel>>({
        items: [],
        page: 1,
        perPage: 5,
        totalItems: 0,
        totalPages: 0
    });

    async function loadCollection(props: { page: number }) {
        const list: ListResult<BaseModel> = await pb.collection(collection).getList(props.page, collectionStore.get().perPage);
        collectionStore.set({...list});
    }

    useEffect(() => {
        loadCollection({page: 1}).then();
        // eslint-disable-next-line
    }, []);

    const id = useId();
    return <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
        <GridToolbar collection={collection} collectionStore={collectionStore} configStore={gridConfigStore}
                     onGridConfigUpdate={saveGridConfig}/>
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <GridHeader gridID={id} collection={collection} configStore={gridConfigStore}/>
            <GridBody collectionStore={collectionStore} gridID={id} collection={collection}
                      configStore={gridConfigStore}/>
            <GridFooter collectionStore={collectionStore} loadCollection={loadCollection}/>
        </div>
    </div>
}

function getPath(props: { route: RouteProps; ignoredParams: string[] }) {
    const path = Array.from(props.route.params.keys()).filter(s => !props.ignoredParams.includes(s)).reduce((path, key) => path.replace(`$${key}`, props.route.params.get(key) ?? ''), props.route.path)
    return path;
}

function useRouteConfig(props: { route: RouteProps,ignoredParams:string[] }) {
    const path = getPath(props);
    console.log("WE HAVE PATH HERE",path)
    const {pb} = useAppContext();
    const gridConfigStore = useStore<RouteConfig<GridConfig>>({
        id: '',
        path: path,
        data: {
            maximumSelection: 1,
            columns: [],
            permission: {
                edit: true,
                delete: true,
                create: true,
                view: true
            }
        }
    });

    const saveGridConfig = useCallback(async function saveGridConfig() {
        if (gridConfigStore.get().id.length > 0) {
            const result: any = await pb.collection('route_config').update(gridConfigStore.get().id, gridConfigStore.get());
            gridConfigStore.set(result);
        } else {
            const result: any = await pb.collection('route_config').create(gridConfigStore.get())
            gridConfigStore.set(result);
        }
    }, [gridConfigStore, pb]);

    useAsyncEffect(async () => {
        try {
            const path = getPath(props);
            const config: any = await pb.collection('route_config').getFirstListItem(`path="${path}"`);
            gridConfigStore.set(config);
        } catch (err) {
            console.log(err);
        }
    }, []);
    return {gridConfigStore, saveGridConfig}
}