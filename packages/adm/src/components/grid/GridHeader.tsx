import {useTable} from "../useTable";
import {checkboxColumnWidth, manageColumnWidth, scrollerWidth, useAverageColumnWidth} from "../useAverageColumn";
import {motion} from "framer-motion";
import {CSSProperties} from "react";

export function GridHeader(props: { gridID: string, collection: string }) {
    const {gridID: id, collection} = props;
    const table = useTable(collection);
    const averageColumnWidth = useAverageColumnWidth(collection);
    return <div style={{display: 'flex', flexGrow: 0, flexShrink: 0, marginRight: scrollerWidth, overflow: 'hidden'}}
                id={`${id}-header`}>
        <div style={{
            width: checkboxColumnWidth,
            flexShrink: 0,
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            borderRight: '1px solid rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
        </div>
        {table.schema.map((schema, index, source) => {
            const isLastColumn = index === source.length - 1;
            return <motion.div key={schema.id} style={{
                width: averageColumnWidth,
                overflow: 'hidden',
                ...tableColumnStyle,
                borderRight: '1px solid rgba(0,0,0,0.1)',
            }}>
                {schema.name}
            </motion.div>
        })}
        <div style={{display: 'flex', flexShrink: 0, flexGrow: 0, width: manageColumnWidth}}>
            {/*    THIS IS FOR THE HEADER COLUMN*/}
        </div>
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

