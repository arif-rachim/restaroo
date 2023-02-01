import {BaseModel, ListResult, Store, useAppContext} from "@restaroo/lib";
import {ButtonSimple} from "../ButtonSimple";
import {IoCreate, IoSettings} from "react-icons/io5";
import {CollectionDetailPanel} from "../CollectionDetailPanel";
import produce from "immer";
import {border, GridConfig as GConfig, RouteConfig} from "./Grid";
import {GridConfig} from "./GridConfig";

export function GridToolbar(props: { collection: string, collectionStore: Store<ListResult<BaseModel>>, configStore: Store<RouteConfig<GConfig>>, onGridConfigUpdate: () => void }) {
    const {collection, collectionStore, configStore, onGridConfigUpdate} = props;
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
            onGridConfigUpdate();
        }}/>
        <ButtonSimple title={'Configure'} icon={IoSettings} onClick={async () => {
            const result: RouteConfig<GConfig> = await showSlidePanel(closePanel => {
                return <GridConfig closePanel={closePanel} collection={collection}
                                   panelConfig={({...configStore.get()})}/>
            }, {position: "right"});
            configStore.set(result);
            // @TODO To save this to server
        }}/>

    </div>;
}