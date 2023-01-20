import {
    BaseModel,
    ButtonTheme,
    ListResult,
    RouteProps,
    StoreValueRenderer,
    useAppContext,
    useAppDimension,
    useStore
} from "@restaroo/lib";
import {pocketBase} from "../service";
import {Table, tables} from "@restaroo/mdl";
import {CSSProperties, useEffect} from "react";
import {DButton} from "../components/DButton";
import {IoCreate} from "react-icons/io5";
import {CollectionDetailPanel} from "../components/CollectionDetailPanel";
import produce from "immer";
import {motion} from "framer-motion";
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
    padding: 10,
    borderRight: border,
    borderBottom: border,
    flexGrow: 0,
    flexShrink: 0
}
const cellStyle:CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    borderRight: border,
    borderBottom: border,
    flexGrow: 0,
    flexShrink: 0
}
const scrollerWidth = 15;
export function CollectionRoute(route: RouteProps) {
    const collection: string = route.params.get('collection') ?? '';
    const table: Table = tables.find(t => t.name === collection) ?? EMPTY_TABLE;
    const {appDimension} = useAppDimension();
    const averageColumnWidth = (appDimension.width - scrollerWidth) / table.schema.length;
    const collectionStore = useStore<ListResult<BaseModel>>({
        items: [],
        page: 1,
        perPage: 5,
        totalItems: 0,
        totalPages: 0
    });
    const {showSlidePanel} = useAppContext();

    async function loadCollection(props: { page: number }) {
        const list: ListResult<BaseModel> = await pocketBase.collection(collection).getList(props.page, collectionStore.get().perPage);
        collectionStore.set({...list});
    }

    useEffect(() => {
        loadCollection({page: 1}).then()
        // eslint-disable-next-line
    }, [])
    return <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
        <div style={{display: 'flex', padding: 10, borderBottom: border}}>
            <DButton title={'New'} icon={IoCreate} theme={ButtonTheme.danger} onTap={async () => {
                const result: BaseModel|false = await showSlidePanel(closePanel => {
                    return <CollectionDetailPanel collectionOrCollectionId={collection} id={'new'}
                                                  closePanel={closePanel}/>
                }, {position: "top"});
                if(result === false){
                    return;
                }
                collectionStore.set(produce(s => {
                    s.items.push(result);
                    s.totalItems = s.totalItems + 1;
                }));

            }}/>
        </div>
        <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:"auto"}}>
        <div style={{display: 'flex', flexGrow: 0, flexShrink: 0}}>
            {table.schema.map((schema, index, source) => {
                const isLastColumn = index === source.length - 1;
                return <div key={schema.id} style={{
                    width: averageColumnWidth, ...tableColumnStyle,
                    borderRight:  border
                }}>
                    {schema.name}
                </div>
            })}
        </div>
        {/*This is the body of the grid*/}
        <StoreValueRenderer store={collectionStore} selector={s => s.items} render={(items: BaseModel[]) => {
            return <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f2f2f2',
                display: 'flex',
                flexDirection: 'column',
                overflowY:'scroll'
            }}>{items.map((row, rowIndex, rowArray) => {
                return <div style={{display: 'flex'}} key={row.id}>
                    {table.schema.map((schema, cellIndex, source) => {
                        const isLastColumn = cellIndex === source.length - 1;
                        const cellValue = row[schema.name] ?? '' ;
                        return <div key={`${rowIndex}:${cellIndex}`} style={{
                            width: averageColumnWidth, ...cellStyle,
                            borderRight: isLastColumn ? 'unset' : border,
                            textOverflow:'ellipsis',
                            overflow:'hidden'
                        }}>
                            {cellValue.toString()}
                        </div>
                    })}
                </div>
            })}</div>
        }}/>
        <StoreValueRenderer store={collectionStore} selector={s => [s.page,s.perPage,s.totalItems,s.totalPages]} render={([page,perPage,totalItems,totalPage]:number[]) => {

            return <div style={{display:'flex',padding:5,justifyContent:'flex-end'}}>
                {Array.from({length:5}).map((_,index) => {
                    if(page > 2){
                        if(page > (totalPage - 2)){
                            return index + totalPage - 4;
                        }
                        return index - 2 + page
                    }

                    return index + 1 ;
                }).filter(t => t <= totalPage).map((val) => {
                    const isSelected = val === page;
                    return <motion.div key={val} style={{border:border,padding:5,marginRight:5,minWidth:25,display:"flex",justifyContent:'center',backgroundColor:isSelected?'blue':'white',color:isSelected?'white':'black'}} whileTap={{scale:0.95}} onClick={() => {
                        loadCollection({page: val}).then()
                    }}>{val}</motion.div>
                })}

            </div>
        }}/>
        </div>
    </div>
}