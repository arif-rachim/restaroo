import {
    BaseModel,
    ButtonTheme,
    ListResult,
    RouteProps,
    StoreValueRenderer,
    useAppContext,
    useAppDimension,
    useStore
} from "@restaroo/lib";
import {pocketBase} from "../service";
import {Table, tables} from "@restaroo/mdl";
import {CSSProperties, useEffect} from "react";
import {DButton} from "../components/DButton";
import {IoCreate} from "react-icons/io5";
import {CollectionDetailPanel} from "../components/CollectionDetailPanel";
import produce from "immer";

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


const border = '1px solid rgba(0,0,0,0.1)';

const tableColumnStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderRight: border,
    borderBottom: border,
    flexGrow: 0,
    flexShrink: 0
}

export function CollectionRoute(route: RouteProps) {
    const collection: string = route.params.get('collection') ?? '';
    const table: Table = tables.find(t => t.name === collection) ?? EMPTY_TABLE;
    const {appDimension} = useAppDimension();
    const averageColumnWidth = appDimension.width / table.schema.length;
    const collectionStore = useStore<ListResult<BaseModel>>({
        items: [],
        page: 1,
        perPage: 50,
        totalItems: 0,
        totalPages: 0
    });
    const {showSlidePanel} = useAppContext();

    async function loadCollection(props: { page: number }) {
        const list: ListResult<BaseModel> = await pocketBase.collection(collection).getList(props.page, collectionStore.get().perPage);
        collectionStore.set({...list});
    }

    useEffect(() => {
        loadCollection({page: 1}).then()
        // eslint-disable-next-line
    }, [])
    return <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
        <div style={{display: 'flex', padding: 10, borderBottom: border}}>
            <DButton title={'New'} icon={IoCreate} theme={ButtonTheme.danger} onTap={async () => {
                const result: BaseModel = await showSlidePanel(closePanel => {
                    return <CollectionDetailPanel collectionOrCollectionId={collection} id={'new'}
                                                  closePanel={closePanel}/>
                }, {position: "top"});
                collectionStore.set(produce(s => {
                    s.items.push(result);
                    s.totalItems = s.totalItems + 1;
                }));

            }}/>
        </div>
        <div style={{display: 'flex', flexGrow: 0, flexShrink: 0}}>
            {table.schema.map((schema, index, source) => {
                const isLastColumn = index === source.length - 1;
                return <div key={schema.id} style={{
                    width: averageColumnWidth, ...tableColumnStyle,
                    borderRight: isLastColumn ? 'unset' : border
                }}>
                    {schema.name}
                </div>
            })}
        </div>

        <StoreValueRenderer store={collectionStore} selector={s => s.items} render={(items: BaseModel[]) => {
            return <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f2f2f2',
                display: 'flex',
                flexDirection: 'column'
            }}>{items.map((row, rowIndex, rowArray) => {
                return <div style={{display: 'flex'}} key={row.id}>
                    {table.schema.map((schema, cellIndex, source) => {
                        const isLastColumn = cellIndex === source.length - 1;
                        const cellValue = row[schema.name];
                        return <div key={`${rowIndex}:${cellIndex}`} style={{
                            width: averageColumnWidth, ...tableColumnStyle,
                            borderRight: isLastColumn ? 'unset' : border
                        }}>
                            {cellValue}
                        </div>
                    })}
                </div>
            })}</div>
        }}/>

    </div>
}