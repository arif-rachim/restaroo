import {useTable} from "../useTable";
import {useAverageColumnWidth} from "../useAverageColumn";
import {motion} from "framer-motion";
import {CSSProperties} from "react";
import {OnEnter, Store, StoreValueRenderer} from "@restaroo/lib";
import {CollectionRoute, FilterOperator, GridFilter} from "./Grid";
import {RouteConfig} from "../useRouteConfig";
import produce from "immer";

export function GridHeader(props: { gridID: string, collection: string, configStore: Store<RouteConfig<CollectionRoute>>, gridFiltersAndOrdersStore: Store<{ filter: GridFilter[], order: string[] }>,onEnter:() => void }) {
    const {gridID: id, collection, configStore, gridFiltersAndOrdersStore,onEnter} = props;
    const table = useTable(collection);


    const width = useAverageColumnWidth(collection, configStore);
    return <div style={{display: 'flex', flexGrow: 0, flexShrink: 0, marginRight: width.scroller, overflow: 'hidden'}}
                id={`${id}-header`}>
        {width.select > 0 &&
            <div style={{
                width: width.select,
                flexShrink: 0,
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                borderRight: '1px solid rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            </div>
        }
        {table.schema.map((schema, index, source) => {
            return <motion.div key={schema.id} style={{
                width: width.standard,
                overflow: 'hidden',
                ...tableColumnStyle,
                borderRight: '1px solid rgba(0,0,0,0.1)',
            }}>
                <StoreValueRenderer store={configStore} selector={(s: RouteConfig<CollectionRoute>) => {
                    const colIndex = s.data.columns.findIndex(c => c.schemaId === schema.id);
                    if (colIndex >= 0) {
                        return s.data.columns[colIndex].label;
                    }
                    return schema.name
                }} render={label => {
                    return <div style={{padding: '2px 5px'}}>{label}</div>
                }}/>
                <OnEnter onEnter={() => {
                    onEnter();
                }}>
                    <input style={{width: '100%'}} onChange={(event) => {
                        gridFiltersAndOrdersStore.set(produce((param:{ filter: GridFilter[], order: string[] }) => {
                            const filterIndex = param.filter.findIndex(f => f.field === schema.name);
                            const value = event.target.value;
                            if(filterIndex >= 0){
                                param.filter[filterIndex].value = value;
                                if(value === ''){
                                    param.filter.splice(filterIndex,1);
                                }
                                // do something here
                            }else if(value !== ''){
                                param.filter.push({value,field:schema.name,operator:FilterOperator.Like})
                            }
                        }));
                    }}/>
                </OnEnter>

            </motion.div>
        })}

        {(width.edit > 0 || width.view > 0) &&
            <div style={{
                width: width.edit,
                overflow: 'hidden',
                ...tableColumnStyle
            }}>
                {/*    THIS IS FOR THE HEADER COLUMN*/}
            </div>
        }
        {width.del > 0 &&
            <div style={{
                width: width.del,
                overflow: 'hidden',
                ...tableColumnStyle
            }}>
                {/*    THIS IS FOR THE HEADER COLUMN*/}
            </div>
        }
    </div>;
}


const tableColumnStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: '1px solid rgba(0,0,0,0.1)',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    flexGrow: 0,
    flexShrink: 0,
}

