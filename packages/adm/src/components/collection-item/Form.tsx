import {
    BaseModel,
    CardTitle,
    isNullOrUndefined,
    StoreValue,
    StoreValueRenderer,
    useAppContext,
    useAppStore,
    useAsyncEffect,
    useNavigateBack,
    useRouteProps,
    useStore,
} from "@restaroo/lib";
import {RouteConfig, useRouteConfig} from "../useRouteConfig";
import {AppState} from "../../index";
import {Table} from "@restaroo/mdl";
import {border, EMPTY_TABLE} from "../collection-list/Grid";
import {ButtonSimple} from "../ButtonSimple";
import {IoExitOutline, IoSaveOutline, IoSettingsOutline} from "react-icons/io5";
import {DInput} from "../DInput";
import produce from "immer";
import {DInputRelation} from "./DInputRelation";
import {DInputDate} from "./DInputDate";
import {FormConfig, FormRouteConfig} from "./FormConfig";

export function Form() {
    const {params} = useRouteProps();
    const [formConfig, saveFormConfig] = useRouteConfig<FormRouteConfig>({ignoredParams: ['id'], initialValue: {}});

    const collection = params.get('collection') ?? '';
    const id = params.get('id') ?? '';
    const closePanel = useNavigateBack();

    const isNew = id === 'new';
    const appStore = useAppStore<AppState>();
    const table: Table = appStore.get().tables.find(t => (t.name === collection || t.id === collection)) ?? EMPTY_TABLE;
    const {showPicker, pb, showSlidePanel} = useAppContext();
    const current = useStore<any>({});
    useAsyncEffect(async () => {
        if (id === 'new') {
            return;
        }
        const result = await pb.collection(collection).getFirstListItem(`id="${id}"`);
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

    return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                maxWidth: 1024,
            }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <CardTitle title={isNew ? 'New Collection' : `Showing Record ID ${id}`}/>
                <div style={{flexGrow: 1}}/>
                <ButtonSimple title={''} onClick={async () => {
                    const config:RouteConfig<FormRouteConfig>|false = await showSlidePanel(closePanel => {
                        return <FormConfig closePanel={closePanel} config={formConfig.get()} />
                    },{position:'right'});
                    if(config !== false){
                        formConfig.set(config);
                    }
                }} icon={IoSettingsOutline}/>
            </div>

            <div style={{display: 'flex', flexWrap: 'wrap', padding: `10px 0px`}}>
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
                    const title = schema.name;

                    return <div key={schema.name} style={{width: '50%'}}>
                        {isText &&
                            <StoreValue store={store} selector={(s: any) => s[schema.name]} property={'value'}>
                                <DInput title={`${title} : `} titlePosition={'left'} titleWidth={100}
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
                                <DInput title={`${title} : `} titlePosition={'left'} titleWidth={100}
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
                                <DInput title={`${title} : `} titlePosition={'left'} titleWidth={100}
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
                            <DInput title={`${title} : `} titlePosition={'left'} titleWidth={100}
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
                style={{display: 'flex', padding: 10, borderTop: border, justifyContent: 'flex-end'}}>

                <ButtonSimple title={'Save'} icon={IoSaveOutline}
                              onClick={async () => {
                                  // here we need to add the checking first about the validity of the data
                                  if (isNew) {
                                      const result = await pb.collection(collection).create(store.get());
                                      closePanel(result);
                                  } else {
                                      const result = await pb.collection(collection).update(id, store.get());
                                      closePanel(result);
                                  }

                              }}/>
                <ButtonSimple title={'Cancel'}
                              icon={IoExitOutline} onClick={() => {
                    // here next time we need to ask question are you sure you want to cancel this ?
                    closePanel(false);
                }}/>
            </div>
        </div>
    </div>
}

const boolDataProvider = [{label: 'Yes', value: true}, {label: 'No', value: false}];

interface Errors {
    [key: string]: string[]
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
        result[schema.name] = '';
        return result;
    }, {});
    value.errors = {...value};
    return value;
}
