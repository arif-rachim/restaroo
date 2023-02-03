import {
    BaseModel,
    ListResult,
    Store,
    StoreValueRenderer,
    useNavigatePromise,
    useStore,
    useStoreValue
} from "@restaroo/lib";
import {useTable} from "../useTable";
import {useAverageColumnWidth} from "../useAverageColumn";
import invariant from "tiny-invariant";
import {motion} from "framer-motion";
import {IoCheckmark, IoEye, IoPencil, IoTrashOutline} from "react-icons/io5";
import produce from "immer";
import {CSSProperties} from "react";
import {GridConfig, RouteConfig} from "./Grid";

const cellStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(0,0,0,0.1)',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    flexGrow: 0,
    flexShrink: 0
}

function CheckBoxColumn(props: { width: number, selectedItemsStore: Store<BaseModel[]>, row: BaseModel }) {
    const {width, row, selectedItemsStore} = props;
    const isSelected = useStoreValue(selectedItemsStore, param => param.map(s => s.id).includes(row.id));
    return <div style={{
        width: width,
        flexShrink: 0,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        borderRight: '1px dashed rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        {isSelected &&
            <IoCheckmark style={{fontSize: 16}}/>
        }
    </div>;
}

export function GridBody(props: { collectionStore: Store<ListResult<BaseModel>>, gridID: string, collection: string, configStore: Store<RouteConfig<GridConfig>> }) {
    const {collection, collectionStore, gridID: id, configStore} = props;
    const table = useTable(collection);
    const width = useAverageColumnWidth(collection, configStore);
    const selectedItemsStore = useStore<BaseModel[]>([]);

    const navigate = useNavigatePromise();

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
                               onClick={() => {
                                   selectedItemsStore.set(produce(old => {
                                       const index = old.findIndex(s => s.id === row.id);
                                       if (index >= 0) {
                                           old.splice(index, 1);
                                       } else {
                                           if (configStore.get().data.maximumSelection === 1) {
                                               for (let i: number = 0; i < old.length; i++) {
                                                   old.pop();
                                               }
                                           }
                                           if (configStore.get().data.maximumSelection > old.length) {
                                               old.push(row);
                                           }
                                       }
                                   }))
                               }}
            >
                {width.select > 0 &&
                    <CheckBoxColumn width={width.select} selectedItemsStore={selectedItemsStore} row={row}/>
                }
                {table.schema.map((schema, cellIndex, source) => {
                    const isLastColumn = cellIndex === source.length - 1;
                    const cellValue = row[schema.name] ?? '';
                    return <div key={`${rowIndex}:${cellIndex}`} style={{
                        width: width.standard, ...cellStyle
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


                {(width.edit > 0 || width.view > 0) && <div style={{
                    ...cellStyle,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    width: width.edit
                }}>
                    <div style={{display: 'flex'}}>
                        <motion.div style={{flexGrow: 1, marginRight: 5}} whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.98}} onClick={async () => {
                            const result: BaseModel | false = await navigate(`collection-item/${collection}/${row.id}`);
                            // const result: BaseModel | false = await showSlidePanel(closePanel => {
                            //     return <CollectionDetailPanel collectionOrCollectionId={collection} id={row.id}
                            //                                   closePanel={closePanel}/>
                            // }, {position: "top"});
                            if (result === false) {
                                return;
                            }

                            collectionStore.set(produce(s => {
                                const index = s.items.findIndex(s => s.id === result.id);
                                s.items.splice(index, 1, result);
                            }));

                        }}>
                            {width.edit > 0 &&
                                <IoPencil style={{fontSize: 18}}/>
                            }
                            {width.edit === 0 && width.view > 0 &&
                                <IoEye style={{fontSize: 18}}/>
                            }
                        </motion.div>
                    </div>
                </div>
                }


                {width.del > 0 && <div style={{
                    ...cellStyle,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    width: width.del
                }}>
                    <div style={{display: 'flex'}}>
                        <motion.div style={{flexGrow: 1, marginRight: 5}} whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.98}} onClick={async () => {
                            alert('TODO');
                        }}>
                            <IoTrashOutline style={{fontSize: 18}}/>
                        </motion.div>
                    </div>
                </div>
                }

            </motion.div>
        })}</div>
    }}/>;
}