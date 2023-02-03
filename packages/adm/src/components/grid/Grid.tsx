import {Table} from "@restaroo/mdl";
import {BaseModel, ListResult, RouteProps, useAppContext, useAsyncEffect, useRouteProps, useStore} from "@restaroo/lib";
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

export function Grid() {
    const route = useRouteProps();

    const collection = route.params.get('collection') ?? '';

    const {routeConfigStore, saveRouteConfig} = useRouteConfig({ignoredParams: []});
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
        <GridToolbar collection={collection} collectionStore={collectionStore} routeConfigStore={routeConfigStore}
                     onRouteConfigUpdate={saveRouteConfig}/>
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <GridHeader gridID={id} collection={collection} configStore={routeConfigStore}/>
            <GridBody collectionStore={collectionStore} gridID={id} collection={collection}
                      configStore={routeConfigStore}/>
            <GridFooter collectionStore={collectionStore} loadCollection={loadCollection}/>
        </div>
    </div>
}

function getPath(props: { route: RouteProps; ignoredParams: string[] }) {
    const path = Array.from(props.route.params.keys()).filter(s => !props.ignoredParams.includes(s)).reduce((path, key) => path.replace(`$${key}`, props.route.params.get(key) ?? ''), props.route.path)
    return path;
}

function useRouteConfig(props: { ignoredParams: string[] }) {
    const route = useRouteProps();
    const path = getPath({ignoredParams: props.ignoredParams, route});
    const {pb} = useAppContext();
    const routeConfigStore = useStore<RouteConfig<GridConfig>>({
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

    const saveRouteConfig = useCallback(async function saveRouteConfig() {
        if (routeConfigStore.get().id.length > 0) {
            const result: any = await pb.collection('route_config').update(routeConfigStore.get().id, routeConfigStore.get());
            routeConfigStore.set(result);
        } else {
            const result: any = await pb.collection('route_config').create(routeConfigStore.get())
            routeConfigStore.set(result);
        }
    }, [routeConfigStore, pb]);

    useAsyncEffect(async () => {
        try {
            const path = getPath({ignoredParams: props.ignoredParams, route});
            const config: any = await pb.collection('route_config').getFirstListItem(`path="${path}"`);
            routeConfigStore.set(config);
        } catch (err) {
            console.log(err);
        }
    }, []);
    return {routeConfigStore: routeConfigStore, saveRouteConfig: saveRouteConfig}
}