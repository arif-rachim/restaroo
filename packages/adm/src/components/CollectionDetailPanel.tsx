import {
    ButtonTheme,
    Card,
    CardTitle,
    dateToDdMmm, dateToDdMmmYyyy,
    dateToHhMm,
    Store,
    StoreValue,
    StoreValueRenderer,
    useAppContext,
    useAppDimension,
    useStore,
    useStoreValue
} from "@restaroo/lib";
import {RelationSchema, Table, tables} from "@restaroo/mdl";
import {DInput} from "./DInput";
import {EMPTY_TABLE} from "../routes/CollectionRoute";
import {DButton} from "./DButton";
import {IoAdd, IoCheckmarkOutline, IoExit, IoSave} from "react-icons/io5";
import produce from "immer";
import invariant from "tiny-invariant";

const border = '1px solid rgba(0,0,0,0.05)';
const boolDataProvider = [{label: 'Yes', value: true}, {label: 'No', value: false}];

export function CollectionDetailPanel(props: { collectionOrCollectionId: string, id: string, closePanel: (params: any) => void }) {
    const {collectionOrCollectionId, id, closePanel} = props;
    const isNew = id === 'new';
    const table: Table = tables.find(t => (t.name === collectionOrCollectionId || t.id === collectionOrCollectionId)) ?? EMPTY_TABLE;
    const {showPicker, pb} = useAppContext();
    const store = useStore(table.schema.reduce((result: any, schema) => {
        let defaultValue: any = '';

        const isNumber = schema.type === 'number';
        const isDate = schema.type === 'date';
        const isBoolean = schema.type === 'bool';
        const isEmail = schema.type === 'email';
        const isFile = schema.type === 'file';
        const isJson = schema.type === 'json';
        const isRelation = schema.type === 'relation';
        const isSelect = schema.type === 'select';
        const isText = schema.type === 'text';
        const isUrl = schema.type === 'url';

        if (isBoolean) {
            defaultValue = undefined;
        }
        if (isNumber) {
            defaultValue = undefined;
        }
        if (isFile) {
            defaultValue = undefined;
        }
        if (isRelation) {
            defaultValue = [];
        }
        if(isDate){
            defaultValue = undefined;
        }

        result[schema.name] = defaultValue;
        return result;
    }, {}));

    return <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            alignItems: 'center'
        }}>
        <Card style={{width: '100%', maxWidth: 800, borderTopLeftRadius: 0, borderTopRightRadius: 0}}>
            <CardTitle title={isNew ? 'New Collection' : 'Showing Record ID ABC123'}/>
            <div style={{display: 'flex', flexWrap: 'wrap', padding: `10px 20px`}}>
                {table.schema.map(schema => {

                    const isNumber = schema.type === 'number';
                    const isDate = schema.type === 'date';
                    const isBoolean = schema.type === 'bool';
                    const isEmail = schema.type === 'email';
                    const isFile = schema.type === 'file';
                    const isJson = schema.type === 'json';
                    const isRelation = schema.type === 'relation';
                    const isSelect = schema.type === 'select';
                    const isText = schema.type === 'text';
                    const isUrl = schema.type === 'url';

                    // const isRequired = schema.required;
                    // const isUnique = schema.unique;


                    return <div key={schema.name} style={{width: '50%'}}>
                        {isText &&
                            <StoreValue store={store} selector={(s: any) => s[schema.name]} property={'value'}>
                                <DInput title={`${schema.name} : `} titlePosition={'left'} titleWidth={100}
                                        placeholder={`Please enter ${schema.name}`}
                                        style={{titleStyle: {paddingLeft: 0, justifyContent: 'flex-end'}}}
                                        onChange={(event) => {
                                            store.set(produce((s: any) => {
                                                s[schema.name] = event.target.value.toUpperCase();
                                            }))
                                        }}/>
                            </StoreValue>
                        }
                        {isBoolean &&
                            <StoreValue store={store}
                                        selector={(s: any) => boolDataProvider.find(v => v.value === s[schema.name])?.label ?? ''}
                                        property={'value'}>
                                <DInput title={`${schema.name} : `} titlePosition={'left'} titleWidth={100}
                                        placeholder={`Please enter ${schema.name}`}
                                        style={{titleStyle: {paddingLeft: 0, justifyContent: 'flex-end'}}}
                                        readOnly={true}
                                        onFocus={async () => {
                                            const val = store.get()[schema.name];
                                            const value = await showPicker({
                                                value: val,
                                                picker: {
                                                    dataProvider: boolDataProvider,
                                                    dataToLabel: d => d.label,
                                                    dataToValue: d => d.value,
                                                    isValueBelongsToData: (val, data) => data.value === val
                                                }
                                            });
                                            store.set(produce((s: any) => {
                                                s[schema.name] = value;
                                            }))

                                        }}/>
                            </StoreValue>
                        }

                        {isNumber &&
                            <StoreValue store={store}
                                        selector={(s: any) => (s[schema.name] ? s[schema.name].toString() : '')}
                                        property={'value'}>
                                <DInput title={`${schema.name} : `} titlePosition={'left'} titleWidth={100}
                                        placeholder={`Please enter ${schema.name}`} inputMode={'numeric'}
                                        type={'number'}
                                        style={{titleStyle: {paddingLeft: 0, justifyContent: 'flex-end'}}}
                                        onChange={(event) => {
                                            store.set(produce((s: any) => {
                                                s[schema.name] = parseFloat(event.target.value);
                                            }))
                                        }}/>
                            </StoreValue>
                        }
                        {isFile &&
                            <DInput title={`${schema.name} : `} titlePosition={'left'} titleWidth={100}
                                    placeholder={`Please enter ${schema.name}`} inputMode={'text'} type={'text'}
                                    style={{titleStyle: {paddingLeft: 0, justifyContent: 'flex-end'}}}/>
                        }
                        {isRelation &&
                            <StoreValue store={store}
                                        selector={(s: any) => (s[schema.name] ? s[schema.name] : [])}
                                        property={'value'}>
                                <DInputRelation schema={schema} onChange={value => {
                                    store.set(produce((s: any) => {
                                        s[schema.name] = value;
                                    }))
                                }}/>
                            </StoreValue>
                        }
                        {isDate &&
                            <StoreValueRenderer store={store}
                                                selector={(s: any) => {
                                                    const value = s[schema.name] ?? new Date().toISOString();
                                                    return value;
                                                }}
                                                render={(dateString: string) => {
                                                    const date = dateString ? new Date(dateString) : new Date();
                                                    return <DInput title={<DInput title={`${schema.name} : `}

                                                                                  titlePosition={'left'}
                                                                                  titleWidth={120}
                                                                                  placeholder={`Please enter ${schema.name}`}
                                                                                  style={{
                                                                                      titleStyle: {
                                                                                          padding: 0,
                                                                                          margin:'0px 10px 0px 0px',
                                                                                          justifyContent: 'flex-end',
                                                                                          flexShrink:0,
                                                                                      },
                                                                                      containerStyle:{
                                                                                          padding:0,
                                                                                          margin:0
                                                                                      },
                                                                                      errorStyle:{
                                                                                          margin:0,
                                                                                          padding:0,
                                                                                          height:0
                                                                                      },
                                                                                      inputStyle : {
                                                                                          padding : 5
                                                                                      }
                                                                                  }}
                                                                                  value={dateToDdMmmYyyy(date)}
                                                                                  readOnly={true}
                                                                                  onFocus={async () => {
                                                                                      const val = store.get()[schema.name];
                                                                                      const value = await showPicker({
                                                                                          picker: 'date',
                                                                                          value: val
                                                                                      });
                                                                                      store.set(produce((s: any) => {
                                                                                          s[schema.name] = value;
                                                                                      }))
                                                                                  }}/>} titlePosition={'left'}

                                                                   placeholder={''}
                                                                   titleWidth={250}
                                                                   value={dateToHhMm(date)}
                                                                   style={{
                                                                       titleStyle: {
                                                                           paddingLeft: 0,
                                                                           paddingBottom:0,
                                                                           margin:'0px 10px 0px 0px',
                                                                           justifyContent: 'flex-end',
                                                                           flexShrink:0
                                                                       },
                                                                       containerStyle:{
                                                                           alignItems:'flex-start'
                                                                       },
                                                                       inputStyle:{
                                                                           padding : '5px 5px'
                                                                       }
                                                                   }}
                                                                   readOnly={true}
                                                                   onFocus={async () => {
                                                                       const val = store.get()[schema.name];
                                                                       const value = await showPicker({
                                                                           value: val,
                                                                           picker: "time"
                                                                       });
                                                                       store.set(produce((s: any) => {
                                                                           s[schema.name] = value;
                                                                       }))
                                                                   }}/>
                                                }}/>

                        }
                    </div>
                })} </div>
            <div
                style={{display: 'flex', padding: '10px 20px 0px 20px', borderTop: border, justifyContent: 'flex-end'}}>


                <DButton title={'Save'} theme={ButtonTheme.danger} icon={IoSave} onTap={async () => {
                    // here we need to add the checking first about the validity of the data
                    const result = await pb.collection(collectionOrCollectionId).create(store.get());
                    closePanel(result);
                }} style={{marginRight: 10}}/>
                <DButton title={'Cancel'} theme={ButtonTheme.promoted} icon={IoExit} onTap={() => {
                    // here next time we need to ask question are you sure you want to cancel this ?
                    closePanel(false);
                }}/>
            </div>
        </Card>
    </div>
}

interface BaseModel {
    [key: string]: any;

    id: string;
    created: string;
    updated: string;
}

interface ListResult<M extends BaseModel> {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: Array<M>;
}


function DInputRelation(props: { schema: RelationSchema, value?: string[], onChange?: (param: string[]) => void }) {

    const {schema, value, onChange} = props;
    const {showSlidePanel, pb} = useAppContext();
    let val = value ?? [];
    return <DInput title={`${schema.name} : `} titlePosition={'left'} titleWidth={100}
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
                    <IoCheckmarkOutline style={{fontSize: 16, color: 'blue'}}/>
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

function MultipleSelectorGrid(props: { closePanel: (params: string[] | false) => void, value: string[], collectionId: string, items: ListResult<any> }) {
    const {closePanel, value, collectionId, items} = props;
    const store = useStore<ListResult<any>>({...items});
    const storeSelectedIds = useStore<string[]>(value);
    const {showSlidePanel} = useAppContext();
    const table = tables.find(t => t.id === collectionId);
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
                    const result = await showSlidePanel(closePanel => {
                        return <CollectionDetailPanel collectionOrCollectionId={collectionId} id={'new'}
                                                      closePanel={closePanel}/>
                    }, {position: "top"});
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
                <DButton title={'Select'} theme={ButtonTheme.danger} icon={IoSave} onTap={async () => {
                    await closePanel(storeSelectedIds.get());
                }} style={{marginRight: 10}}/>
                <DButton title={'Cancel'} theme={ButtonTheme.promoted} icon={IoExit} onTap={async () => {
                    await closePanel(false);
                }}/>
            </div>
        </Card></div>
}