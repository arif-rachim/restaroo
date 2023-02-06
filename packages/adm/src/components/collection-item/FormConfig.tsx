import {RouteConfig} from "../useRouteConfig";
import {Card, CardTitle, StoreValueRenderer, useAppStore, useRouteProps, useStore} from "@restaroo/lib";
import {ButtonSimple} from "../ButtonSimple";
import {IoClose} from "react-icons/io5";
import {useTable} from "../useTable";
import {ConfigColumn} from "../collection-list/Grid";
import {AppState} from "../../index";
import produce from "immer";

export interface FormRouteConfig {
    fields: ConfigColumn[],
}

export function FormConfig(props: { closePanel: (param: false | RouteConfig<FormRouteConfig>) => void, panelConfig: RouteConfig<FormRouteConfig> }) {
    const {closePanel, panelConfig} = props;
    const panelConfigStore = useStore<RouteConfig<FormRouteConfig>>(panelConfig);
    const collection = useRouteProps().params.get('collection') ?? '';
    const table = useTable(collection);
    const store = useAppStore<AppState>();
    return <Card style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        height: '100%',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    }}>
        <CardTitle title={collection}/>
        <table style={{display: 'flex', flexDirection: 'column', padding: 10}}>
            <tbody>
            {table.schema.map((schema) => {
                return <tr key={schema.id}>
                    <td>{schema.name}</td>
                    <td>
                        <StoreValueRenderer store={panelConfigStore} selector={s => {
                            const index = s.data.fields.findIndex((s: ConfigColumn) => s.schemaId === schema.id);
                            let column: ConfigColumn = {
                                schemaId: schema.id,
                                widthPercentage: 10,
                                minWidth: 100,
                                visible: true,
                                label: ''
                            }
                            if (index >= 0) {
                                column = s.data.fields[index];
                            }
                            return column.label;
                        }} render={(label: string) => {
                            return <input style={{margin: '3px 0px 3px 10px'}} value={label} onChange={(event) => {
                                const value = event.target.value;
                                panelConfigStore.set(produce(s => {
                                    const index = s.data.fields.findIndex((s: ConfigColumn) => s.schemaId === schema.id);
                                    if (index >= 0) {
                                        s.data.fields[index].label = value;
                                    } else {
                                        s.data.fields.push({
                                            schemaId: schema.id,
                                            widthPercentage: 10,
                                            minWidth: 100,
                                            visible: true,
                                            label: value
                                        });
                                    }
                                }))
                            }}/>
                        }}/>

                    </td>
                </tr>
            })}
            </tbody>
        </table>
        <div style={{display: 'flex', padding: 10}}>
            <div style={{flexGrow: 1}}></div>
            <ButtonSimple style={{border: '1px solid rgba(0,0,0,0.1)'}} onClick={() => {
                closePanel(panelConfigStore.get());
            }} title={'Close'} icon={IoClose}/>
        </div>
    </Card>
}

