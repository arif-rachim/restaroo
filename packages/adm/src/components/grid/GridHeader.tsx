import {useTable} from "../useTable";
import {useAverageColumnWidth} from "../useAverageColumn";
import {motion} from "framer-motion";
import {CSSProperties} from "react";
import {Store} from "@restaroo/lib";
import {Config} from "./Grid";

export function GridHeader(props: { gridID: string, collection: string, configStore: Store<Config> }) {
    const {gridID: id, collection, configStore} = props;
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
                {schema.name}
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
    padding: 5
}

