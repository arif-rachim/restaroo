import {
    blue,
    ButtonTheme,
    Card,
    CardTitle,
    dateToDdMmmYyyy,
    dateToHhMm,
    isNullOrUndefined,
    PickerOptions,
    Store,
    StoreValue,
    StoreValueRenderer,
    useAppContext,
    useAppDimension,
    useAppStore,
    useAsyncEffect,
    useStore,
    useStoreValue
} from "@restaroo/lib";
import {DateSchema, RelationSchema, Table} from "@restaroo/mdl";
import {DInput} from "./DInput";
import {DButton} from "./DButton";
import {IoAdd, IoCheckmarkOutline, IoExit, IoSave} from "react-icons/io5";
import produce from "immer";
import invariant from "tiny-invariant";
import {EMPTY_TABLE} from "./CollectionGridPanel";
import {AppState} from "../index";
import {ButtonSimple} from "./ButtonSimple";

const border = '1px solid rgba(0,0,0,0.05)';
const boolDataProvider = [{label: 'Yes', value: true}, {label: 'No', value: false}];

interface Errors {
    [key: string]: string[]
}

function DInputDate<T>(props: { schema: DateSchema, date: Date, store: Store<any>, showPicker: <T>(props: { picker: PickerOptions; value: T }) => Promise<T> }) {
    const {store, showPicker, date, schema} = props;
    return <DInput title={<DInput title={`${schema.name} : `}

                                  titlePosition={'left'}
                                  titleWidth={120}
                                  placeholder={`Please enter ${schema.name}`}
                                  style={{
                                      titleStyle: {
                                          padding: 0,
                                          margin: '0px 10px 0px 0px',
                                          justifyContent: 'flex-end',
                                          flexShrink: 0,
                                      },
                                      containerStyle: {
                                          padding: 0,
                                          margin: 0
                                      },
                                      errorStyle: {
                                          margin: 0,
                                          padding: 0,
                                          height: 0
                                      },
                                      inputStyle: {
                                          padding: 5
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
                           paddingBottom: 0,
                           margin: '0px 10px 0px 0px',
                           justifyContent: 'flex-end',
                           flexShrink: 0
                       },
                       containerStyle: {
                           alignItems: 'flex-start'
                       },
                       inputStyle: {
                           padding: '5px 5px'
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
                   }}/>;
}

type StoreType<T extends BaseModel> = T & { errors: Errors };

function initializeDefaultValue(table: Table) {
    const value = table.schema.reduce((result: any, schema) => {
        // const isRelation = schema.type === 'relation';
        // const isNumber = schema.type === 'number';
        // const isDate = schema.type === 'date';
        // const isBoolean = schema.type === 'bool';
        // const isEmail = schema.type === 'email';
        // const isFile = schema.type === 'file';
        // const isJson = schema.type === 'json';
        // const isSelect = schema.type === 'select';
        // const isText = schema.type === 'text';
        // const isUrl = schema.type === 'url';
        result[schema.name] = undefined;
        return result;
    }, {});
    value.errors = {...value};
    return value;
}

export function CollectionDetailPanel(props: { collectionOrCollectionId: string, id: string, closePanel: (params: any) => void }) {
    const {collectionOrCollectionId, id, closePanel} = props;
    const isNew = id === 'new';
    const appStore = useAppStore<AppState>();
    const table: Table = appStore.get().tables.find(t => (t.name === collectionOrCollectionId || t.id === collectionOrCollectionId)) ?? EMPTY_TABLE;
    const {showPicker, pb} = useAppContext();
    const current = useStore<any>({});
    useAsyncEffect(async () => {
        const result = await pb.collection(collectionOrCollectionId).getFirstListItem(`id="${id}"`);
        if (result) {
            current.set(result);
            store.set({...result});
        }
    }, [id]);

    const store = useStore<StoreType<any>>(initializeDefaultValue(table));

    function validateForm(): Errors {
        const formValue = store.get();
        const errors = table.schema.reduce((errors: any, schema) => {
            const value = formValue[schema.name];
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
            let err = [];
            if (isText) {
                if (schema.options.min) {
                    if (isNullOrUndefined(value) || value.length < schema.options.min) {
                        err.push('Minimum value is ' + schema.options.min);
                    }
                }
                if (schema.options.max) {
                    if (!isNullOrUndefined(value) && value.length > schema.options.max) {
                        err.push('Maximum value is ' + schema.options.max)
                    }
                }
                if (schema.options.pattern) {
                    console.log("WE NEED TO ADD VALIDATION AGAINST PATTERN")
                }
            }

            if (err.length > 0) {
                errors[schema.name] = err;
            }
            return errors;
        }, {});
        return errors;
    }

    return <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            alignItems: 'center'
        }}>
        <Card style={{
            width: '100%',
            maxWidth: 800,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            padding: 0,
            overflow: 'hidden'
        }}>
            <CardTitle title={isNew ? 'New Collection' : `Showing Record ID ${id}`}/>
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
                                                s[schema.name] = event.target.value;
                                            }))
                                        }} onBlur={() => {
                                    store.set(produce((s: any) => {
                                        const value = s[schema.name];
                                        if (value) {
                                            s[schema.name] = value.toUpperCase();
                                        }
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
                                                selector={(s: any) => (s[schema.name] ?? new Date().toISOString())}
                                                render={(dateString: string) => {
                                                    const date = dateString ? new Date(dateString) : new Date();
                                                    return <DInputDate schema={schema} date={date} store={store}
                                                                       showPicker={showPicker}/>
                                                }}/>

                        }
                    </div>
                })} </div>
            <div
                style={{display: 'flex', padding: 0, borderTop: border, justifyContent: 'flex-end'}}>

                <ButtonSimple title={'Save'} style={{borderLeft: '1px solid rgba(0,0,0,0.1)'}} icon={IoSave}
                              onClick={async () => {
                                  // here we need to add the checking first about the validity of the data
                                  if (isNew) {
                                      const result = await pb.collection(collectionOrCollectionId).create(store.get());
                                      closePanel(result);
                                  } else {
                                      const result = await pb.collection(collectionOrCollectionId).update(id, store.get());
                                      closePanel(result);
                                  }

                              }}/>
                <ButtonSimple title={'Cancel'} icon={IoExit} onClick={() => {
                    // here next time we need to ask question are you sure you want to cancel this ?
                    closePanel(false);
                }}/>
            </div>
        </Card>
    </div>
}

interface BaseModel {
    id: string;
    created: string;
    updated: string;

    [key: string]: any;
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

function MultipleSelectorGrid(props: { closePanel: (params: string[] | false) => void, value: string[], collectionId: string, items: ListResult<any> }) {
    const {closePanel, value, collectionId, items} = props;
    const store = useStore<ListResult<any>>({...items});
    const appStore = useAppStore<AppState>();
    const storeSelectedIds = useStore<string[]>(value);
    const {showSlidePanel} = useAppContext();
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