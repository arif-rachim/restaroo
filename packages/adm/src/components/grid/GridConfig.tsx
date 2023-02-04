import {Card, CardTitle, StoreValueRenderer, useAppStore, useStore} from "@restaroo/lib";
import {IoClose} from "react-icons/io5";
import {AppState} from "../../index";
import {useTable} from "../useTable";
import {ButtonSimple} from "../ButtonSimple";
import {ConfigColumn, CollectionRoute} from "./Grid";
import produce from "immer";
import {RouteConfig} from "../useRouteConfig";

export function GridConfig(props: { closePanel: (param: RouteConfig<CollectionRoute>) => void, collection: string, panelConfig: RouteConfig<CollectionRoute> }) {
    const {closePanel, collection, panelConfig} = props;
    const panelConfigStore = useStore<RouteConfig<CollectionRoute>>(panelConfig);
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
                            const index = s.data.columns.findIndex((s: ConfigColumn) => s.schemaId === schema.id);
                            let column: ConfigColumn = {
                                schemaId: schema.id,
                                widthPercentage: 10,
                                minWidth: 100,
                                visible: true,
                                label: ''
                            }
                            if (index >= 0) {
                                column = s.data.columns[index];
                            }
                            return column.label;
                        }} render={(label: string) => {
                            return <input style={{margin: '3px 0px 3px 10px'}} value={label} onChange={(event) => {
                                const value = event.target.value;
                                panelConfigStore.set(produce(s => {
                                    const index = s.data.columns.findIndex((s: ConfigColumn) => s.schemaId === schema.id);
                                    if (index >= 0) {
                                        s.data.columns[index].label = value;
                                    } else {
                                        s.data.columns.push({
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