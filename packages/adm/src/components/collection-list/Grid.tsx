import {Table} from "@restaroo/mdl";
import {BaseModel, ListResult, useAppContext, useRouteProps, useStore} from "@restaroo/lib";
import {useEffect, useId} from "react";
import {GridFooter} from "./GridFooter";
import {GridBody} from "./GridBody";
import {GridHeader} from "./GridHeader";
import {GridToolbar} from "./GridToolbar";
import {useRouteConfig} from "../useRouteConfig";


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


export interface ConfigColumn {
    schemaId: string,
    label: string,
    visible: boolean,
    minWidth: number,
    widthPercentage: number
}

export interface CollectionRoute {
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

    const [routeConfigStore, saveRouteConfig] = useRouteConfig<CollectionRoute>({
        ignoredParams: [], initialValue: {
            columns: [], permission: {
                edit: true,
                delete: true,
                create: true,
                view: true
            }, maximumSelection: 1
        }
    });

    const {pb} = useAppContext();

    const collectionStore = useStore<ListResult<BaseModel>>({
        items: [],
        page: 1,
        perPage: 50,
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
    return <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%',overflow:'auto'}}>
        <GridToolbar collection={collection} collectionStore={collectionStore} routeConfigStore={routeConfigStore}
                     onRouteConfigUpdate={saveRouteConfig}/>
        <div style={{display: 'flex', flexDirection: 'column', height: '100%',overflow:'auto'}}>
            <GridHeader gridID={id} collection={collection} configStore={routeConfigStore}/>
            <GridBody collectionStore={collectionStore} gridID={id} collection={collection}
                      configStore={routeConfigStore}/>
            <GridFooter collectionStore={collectionStore} loadCollection={loadCollection}/>
        </div>
    </div>
}
