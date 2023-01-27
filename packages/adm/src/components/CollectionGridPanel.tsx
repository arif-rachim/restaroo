import {Table} from "@restaroo/mdl";
import {BaseModel, blue, ListResult, Store, StoreValueRenderer, useAppContext, useStore} from "@restaroo/lib";
import {CSSProperties, useEffect, useId} from "react";
import {IoCheckmark, IoCreate, IoPencil, IoSettings, IoTrashOutline} from "react-icons/io5";
import {CollectionDetailPanel} from "./CollectionDetailPanel";
import produce from "immer";
import {motion} from "framer-motion";
import invariant from "tiny-invariant";
import {ConfigurationForGridPanel} from "./ConfigurationForGridPanel";
import {ButtonSimple} from "./ButtonSimple";
import {useTable} from "./useTable";
import {checkboxColumnWidth, manageColumnWidth, scrollerWidth, useAverageColumnWidth} from "./useAverageColumn";


export const EMPTY_TABLE: Table = {
    schema: [],
    name: '',
    id: '',
    created: '',
    createRule: '',
    deleteRule: '',
    options: {},
    system: false,
    type: 'base',
    updated: '',
    listRule: '',
    updateRule: '',
    viewRule: ''
}

const border = '1px solid rgba(0,0,0,0.1)';

const tableColumnStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: border,
    borderBottom: border,
    flexGrow: 0,
    flexShrink: 0,
    padding: 5
}
const cellStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: '5px 10px',
    borderRight: border,
    borderBottom: border,
    flexGrow: 0,
    flexShrink: 0
}


function GridHeader(props: { gridID: string, collection: string }) {
    const {gridID: id, collection} = props;
    const table = useTable(collection);
    const averageColumnWidth = useAverageColumnWidth(collection);
    return <div style={{display: 'flex', flexGrow: 0, flexShrink: 0, marginRight: scrollerWidth, overflow: 'hidden'}}
                id={`${id}-header`}>
        <div style={{
            width: checkboxColumnWidth,
            flexShrink: 0,
            borderBottom: border,
            borderRight: border,
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
                borderRight: border,
            }}>
                {schema.name}
            </motion.div>
        })}
        <div style={{display: 'flex', flexShrink: 0, flexGrow: 0, width: manageColumnWidth}}>
            {/*    THIS IS FOR THE HEADER COLUMN*/}
        </div>
    </div>;
}

function GridBody<T>(props: { collectionStore: Store<ListResult<BaseModel>>, gridID: string, collection: string }) {
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
                    borderBottom: border,
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
                            overflow: 'hidden'
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

function GridFooter(props: { collectionStore: Store<ListResult<BaseModel>>, loadCollection: (props: { page: number }) => Promise<void> }) {
    const {collectionStore, loadCollection} = props;
    return <StoreValueRenderer store={collectionStore} selector={s => [s.page, s.perPage, s.totalItems, s.totalPages]}
                               render={([page, perPage, totalItems, totalPage]: number[]) => {

                                   return <div style={{display: 'flex', padding: 5, justifyContent: 'flex-end'}}>
                                       {Array.from({length: 5}).map((_, index) => {
                                           if (page > 2) {
                                               if (page > (totalPage - 2)) {
                                                   return index + totalPage - 4;
                                               }
                                               return index - 2 + page
                                           }

                                           return index + 1;
                                       }).filter(t => t <= totalPage).map((val) => {
                                           const isSelected = val === page;
                                           return <motion.div key={val} style={{
                                               border: border,
                                               padding: 5,
                                               marginRight: 5,
                                               minWidth: 25,
                                               display: "flex",
                                               justifyContent: 'center',
                                               backgroundColor: isSelected ? blue : 'white',
                                               color: isSelected ? 'white' : 'black'
                                           }} whileTap={{scale: 0.95}} onClick={() => {
                                               loadCollection({page: val}).then()
                                           }}>{val}</motion.div>
                                       })}
                                   </div>
                               }}/>;
}


function GridToolbar<T>(props: { collection: string, collectionStore: Store<ListResult<BaseModel>> }) {
    const {collection, collectionStore} = props;
    const {showSlidePanel} = useAppContext();
    return <div style={{display: 'flex', borderBottom: border}}>
        <ButtonSimple title={'New'} icon={IoCreate} onClick={async () => {
            const result: BaseModel | false = await showSlidePanel(closePanel => {
                return <CollectionDetailPanel collectionOrCollectionId={collection} id={'new'}
                                              closePanel={closePanel}/>
            }, {position: "top"});
            if (result === false) {
                return;
            }
            collectionStore.set(produce(s => {
                s.items.push(result);
                s.totalItems = s.totalItems + 1;
            }));

        }}/>
        <ButtonSimple title={'Configure'} icon={IoSettings} onClick={async () => {
            const result: BaseModel | false = await showSlidePanel(closePanel => {
                return <ConfigurationForGridPanel closePanel={closePanel} collectionOrConfigId={collection}/>
            }, {position: "right"});
            if (result === false) {
                return;
            }

        }}/>
        {/*<DButton title={'New'} icon={IoCreate} theme={ButtonTheme.danger} onTap={async () => {*/}
        {/*    const result: BaseModel | false = await showSlidePanel(closePanel => {*/}
        {/*        return <CollectionDetailPanel collectionOrCollectionId={collection} id={'new'}*/}
        {/*                                      closePanel={closePanel}/>*/}
        {/*    }, {position: "top"});*/}
        {/*    if (result === false) {*/}
        {/*        return;*/}
        {/*    }*/}
        {/*    collectionStore.set(produce(s => {*/}
        {/*        s.items.push(result);*/}
        {/*        s.totalItems = s.totalItems + 1;*/}
        {/*    }));*/}

        {/*}} style={{marginRight: 10}}/>*/}
        {/*<DButton title={'Configure Page'} icon={IoSettings} theme={ButtonTheme.normal} onTap={async () => {*/}
        {/*    const result: BaseModel | false = await showSlidePanel(closePanel => {*/}
        {/*        return <ConfigurationForGridPanel closePanel={closePanel} collectionOrConfigId={''}/>*/}
        {/*    }, {position: "right"});*/}
        {/*    if (result === false) {*/}
        {/*        return;*/}
        {/*    }*/}

        {/*}}/>*/}
    </div>;
}


export function CollectionGridPanel(props: { collection: string }) {
    const {collection} = props;
    const {pb} = useAppContext();

    const collectionStore = useStore<ListResult<BaseModel>>({
        items: [],
        page: 1,
        perPage: 5,
        totalItems: 0,
        totalPages: 0
    });


    async function loadCollection(props: { page: number }) {
        const list: ListResult<BaseModel> = await pb.collection(collection).getList(props.page, collectionStore.get().perPage);
        collectionStore.set({...list});
    }

    useEffect(() => {
        loadCollection({page: 1}).then()
        // eslint-disable-next-line
    }, []);

    const id = useId();
    return <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
        <GridToolbar collection={collection} collectionStore={collectionStore}/>
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <GridHeader gridID={id} collection={collection}/>
            <GridBody collectionStore={collectionStore} gridID={id} collection={collection}/>
            <GridFooter collectionStore={collectionStore} loadCollection={loadCollection}/>
        </div>
    </div>
}