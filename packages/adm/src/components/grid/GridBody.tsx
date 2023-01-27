import {BaseModel, ListResult, Store, StoreValueRenderer, useAppContext} from "@restaroo/lib";
import {useTable} from "../useTable";
import {checkboxColumnWidth, manageColumnWidth, useAverageColumnWidth} from "../useAverageColumn";
import invariant from "tiny-invariant";
import {motion} from "framer-motion";
import {IoCheckmark, IoPencil, IoTrashOutline} from "react-icons/io5";
import {CollectionDetailPanel} from "../CollectionDetailPanel";
import produce from "immer";
import {CSSProperties} from "react";

const cellStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(0,0,0,0.1)',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    flexGrow: 0,
    flexShrink: 0
}


export function GridBody<T>(props: { collectionStore: Store<ListResult<BaseModel>>, gridID: string, collection: string }) {
    const {collection, collectionStore, gridID: id} = props;
    const table = useTable(collection);
    const averageColumnWidth = useAverageColumnWidth(collection);

    const {showSlidePanel} = useAppContext();
    return <StoreValueRenderer store={collectionStore} selector={s => s.items} render={(items: BaseModel[]) => {
        return <div style={{
            flexGrow: 1,
            backgroundColor: '#f2f2f2',
            display: 'flex',
            flexDirection: 'column',
            overflowY: "scroll",
            overflowX: 'auto'
        }} onScroll={(event) => {
            const header = document.getElementById(`${id}-header`);
            invariant(header);
            header.scrollLeft = (event.target as HTMLDivElement).scrollLeft
        }}>{items.map((row, rowIndex, rowArray) => {
            const isEven = rowIndex % 2 === 0;
            return <motion.div style={{display: 'flex', backgroundColor: isEven ? '#f2f2f2' : '#fff'}}
                               key={row.id}
                               whileHover={{backgroundColor: '#e2e2e2'}}
            >
                <div style={{
                    width: checkboxColumnWidth,
                    flexShrink: 0,
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    borderRight: '1px dashed rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <IoCheckmark style={{fontSize: 16}}/>
                </div>
                {table.schema.map((schema, cellIndex, source) => {
                    const isLastColumn = cellIndex === source.length - 1;
                    const cellValue = row[schema.name] ?? '';
                    return <div key={`${rowIndex}:${cellIndex}`} style={{
                        width: averageColumnWidth, ...cellStyle,
                        borderRight: isLastColumn ? 'unset' : '1px dashed rgba(0,0,0,0.05)',
                    }}>
                        <div style={{
                            display: 'inline-block',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            padding: '3px 5px'
                        }}>
                            {cellValue.toString()}
                        </div>
                    </div>
                })}
                <div style={{
                    ...cellStyle,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    borderRight: 'unset',
                    width: manageColumnWidth
                }}>
                    <div style={{display: 'flex'}}>
                        <motion.div style={{flexGrow: 1, marginRight: 5}} whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.98}} onClick={async () => {
                            const result: BaseModel | false = await showSlidePanel(closePanel => {
                                return <CollectionDetailPanel collectionOrCollectionId={collection} id={row.id}
                                                              closePanel={closePanel}/>
                            }, {position: "top"});
                            if (result === false) {
                                return;
                            }

                            collectionStore.set(produce(s => {
                                const index = s.items.findIndex(s => s.id === result.id);
                                s.items.splice(index, 1, result);
                            }));

                        }}>
                            <IoPencil style={{fontSize: 18}}/>
                        </motion.div>
                        <motion.div style={{flexGrow: 1}} whileHover={{scale: 1.1}} whileTap={{scale: 0.98}}>
                            <IoTrashOutline style={{fontSize: 18}}/>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        })}</div>
    }}/>;
}