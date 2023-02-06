import {RelationSchema, Table} from "@restaroo/mdl";
import {
    BaseModel,
    blue,
    ButtonTheme,
    Card,
    CardTitle,
    Store,
    StoreValueRenderer,
    useAppContext,
    useAppDimension,
    useAppStore,
    useNavigatePromise,
    useStore,
    useStoreValue
} from "@restaroo/lib";
import {DInput} from "../DInput";
import {AppState} from "../../index";
import invariant from "tiny-invariant";
import {DButton} from "../DButton";
import {IoAdd, IoCheckmarkOutline, IoExitOutline, IoSaveOutline} from "react-icons/io5";
import produce from "immer";
import {border} from "../collection-list/Grid";

export function DInputRelation(props: {title:string, schema: RelationSchema, value?: string[], onChange?: (param: string[]) => void }) {

    const {schema, value, onChange,title} = props;
    const {showSlidePanel, pb} = useAppContext();
    let val = value ?? [];
    return <DInput title={`${title} : `} titlePosition={'left'} titleWidth={100}
                   value={val.join(', ')}
                   readOnly={true}
                   placeholder={`Please enter ${schema.name}`} inputMode={'text'} type={'text'}
                   style={{titleStyle: {paddingLeft: 0, justifyContent: 'flex-end'}}} onFocus={async () => {
        const items: ListResult<any> = await pb.collection(schema.options.collectionId).getList(1, 50);

        const selectedRelation = await showSlidePanel((closePanel: (param: (string[] | false)) => void) => {
            return <MultipleSelectorGrid closePanel={closePanel} value={val} collectionId={schema.options.collectionId}
                                         items={items}/>
        }, {isPopup: true, position: "bottom"});
        if (selectedRelation !== false && onChange) {
            onChange(selectedRelation);
        }
    }}/>
}


interface ListResult<M extends BaseModel> {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: Array<M>;
}


function MultipleSelectorGrid(props: { closePanel: (params: string[] | false) => void, value: string[], collectionId: string, items: ListResult<any> }) {
    const {closePanel, value, collectionId, items} = props;
    const store = useStore<ListResult<any>>({...items});
    const appStore = useAppStore<AppState>();
    const storeSelectedIds = useStore<string[]>(value);
    const navigate = useNavigatePromise();
    const table = appStore.get().tables.find(t => t.id === collectionId);
    const dimension = useAppDimension();
    invariant(table);
    return <div style={{display: 'flex', justifyContent: 'center'}}>
        <Card style={{
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: '#f2f2f2',
            maxWidth: 800,
            maxHeight: dimension.appDimension.height - 50,
            width: '100%'
        }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <StoreValueRenderer render={(items: any[]) => {
                    const totalSelectedItems = items.length;
                    return <CardTitle title={`${totalSelectedItems} Items selected`}/>
                }} store={storeSelectedIds} selector={s => s}/>

                <div style={{flexGrow: 1}}/>
                <DButton title={'New'} icon={IoAdd}
                         style={{backgroundColor: '#f2f2f2', margin: 0, padding: '2px 5px', marginRight: 10}}
                         theme={ButtonTheme.danger} onTap={async () => {
                    const result = await navigate(`collection-item/${collectionId}/new`);

                    store.set(produce(state => {
                        state.items.push(result);
                        state.totalItems = state.totalItems + 1;
                    }))
                }}/>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
                <StoreValueRenderer render={(items: any[]) => {
                    return <>
                        {items.map((item, index) => {
                            return <RenderRowItem key={index} item={item} storeSelectedIds={storeSelectedIds}
                                                  table={table}/>
                        })}
                    </>
                }} store={store} selector={s => s.items}/>
            </div>
            <div style={{display: 'flex', padding: '10px 5px 5px 10px', borderTop: border, justifyContent: 'flex-end'}}>
                <DButton title={'Select'} theme={ButtonTheme.danger} icon={IoSaveOutline} onTap={async () => {
                    await closePanel(storeSelectedIds.get());
                }} style={{marginRight: 10}}/>
                <DButton title={'Cancel'} theme={ButtonTheme.promoted} icon={IoExitOutline} onTap={async () => {
                    await closePanel(false);
                }}/>
            </div>
        </Card></div>
}


function RenderRowItem(props: { table: Table, item: BaseModel, storeSelectedIds: Store<string[]> }) {
    const {table, item, storeSelectedIds} = props;
    const isSelected = useStoreValue(storeSelectedIds, s => s).includes(item.id);

    return <Card style={{margin: 5, padding: '5px 10px', borderRadius: 5}}
                 onClick={() => {
                     if (isSelected) {
                         storeSelectedIds.set(old => old.filter(o => o !== item.id));
                     } else {
                         storeSelectedIds.set(old => [...old, item.id]);
                     }
                 }}>
        <div style={{display: 'flex'}}>
            <div style={{width: 25, display: 'flex', alignItems: 'center', flexShrink: 0}}>
                {isSelected &&
                    <IoCheckmarkOutline style={{fontSize: 16, color: blue}}/>
                }
            </div>
            <div style={{display: "flex", flexWrap: 'wrap', flexGrow: 1, overflow: 'hidden'}}>
                {table.schema.map((schema, index) => {
                    const isText = schema.type === 'text';
                    const isBoolean = schema.type === 'bool';
                    const isNumber = schema.type === 'number';
                    const isFile = schema.type === 'file';
                    const isRelation = schema.type === 'relation';

                    if (isText) {

                    }
                    if (isBoolean) {

                    }
                    if (isNumber) {

                    }
                    if (isFile) {

                    }
                    if (isRelation) {

                    }
                    return <div key={index} style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                        <div style={{fontWeight: 'bold', fontSize: '0.95rem', marginBottom: 3}}>{schema.name}</div>
                        <div style={{
                            fontSize: '1.1rem',
                            width: '100%',
                            textOverflow: 'clip'
                        }}>{(item[schema.name] ?? '').toString()}</div>
                    </div>
                })}
            </div>
        </div>
    </Card>;
}
