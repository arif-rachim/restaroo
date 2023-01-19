import {ButtonTheme, RouteProps, useAppContext, useAppDimension, useStore} from "@restaroo/lib";
import {pocketBase} from "../service";
import {tables, Table} from "@restaroo/mdl";
import {CSSProperties, useEffect} from "react";
import {DButton} from "../components/DButton";
import {IoCreate} from "react-icons/io5";
import {CollectionDetailPanel} from "../components/CollectionDetailPanel";

export const EMPTY_TABLE:Table = {
    schema : [],
    name : '',
    id : '',
    created : '',
    createRule : '',
    deleteRule: '',
    options:{

    },
    system:false,
    type:'base',
    updated:'',
    listRule:'',
    updateRule:'',
    viewRule:''
}


const border = '1px solid rgba(0,0,0,0.1)';

const tableColumnStyle:CSSProperties = {
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    padding:10,
    borderRight : border,
    borderBottom : border,
    flexGrow:0,
    flexShrink:0
}

interface CollectionStore{
    items: any[],
    page: number,
    perPage: number,
    totalItems: number,
    totalPages: number
}
export function CollectionRoute(route: RouteProps) {
    const collection: string = route.params.get('collection') ?? '';
    const table: Table  = tables.find(t => t.name === collection) ?? EMPTY_TABLE;
    const {appDimension} = useAppDimension();
    const averageColumnWidth = appDimension.width / table.schema.length;
    const collectionStore = useStore<CollectionStore>({items:[],page:1,perPage:50,totalItems:0,totalPages:0});
    const {showSlidePanel} = useAppContext();
    async function loadCollection(props:{page:number}){
        const list:CollectionStore = await pocketBase.collection(collection).getList(props.page,collectionStore.get().perPage);
        collectionStore.set(list);
    }

    useEffect(() => {
        loadCollection({page:1}).then()
        // eslint-disable-next-line
    },[])
    return <div style={{display: 'flex', flexDirection: 'column',width:'100%',height:'100%'}}>
        <div style={{display:'flex',padding:10,borderBottom:border}}>
            <DButton title={'New'} icon={IoCreate} theme={ButtonTheme.danger} onTap={async () => {
                const result = await showSlidePanel(closePanel => {
                    return <CollectionDetailPanel collectionOrCollectionId={collection} id={'new'} closePanel={closePanel}/>
                },{position:"top"});
                console.log('HELLO WE HAVE result here',result);
            }}/>
        </div>
        <div style={{display: 'flex',flexGrow:0,flexShrink:0}}>
            {table.schema.map((schema,index,source) => {
                const isLastColumn = index === source.length - 1;
                return <div key={schema.id} style={{width:averageColumnWidth,...tableColumnStyle,borderRight:isLastColumn?'unset':border}}>
                    {schema.name}
                </div>
            })}
        </div>
        <div style={{width:'100%',height:'100%',backgroundColor:'#f2f2f2'}}>

        </div>
    </div>
}