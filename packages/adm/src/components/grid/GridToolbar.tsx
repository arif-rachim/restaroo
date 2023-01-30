import {BaseModel, ListResult, Store, useAppContext} from "@restaroo/lib";
import {ButtonSimple} from "../ButtonSimple";
import {IoCreate, IoSettings} from "react-icons/io5";
import {CollectionDetailPanel} from "../CollectionDetailPanel";
import produce from "immer";
import {GridConfig} from "./GridConfig";
import {border, PanelConfig} from "./Grid";

export function GridToolbar<T>(props: { collection: string, collectionStore: Store<ListResult<BaseModel>>, configStore: Store<PanelConfig> }) {
    const {collection, collectionStore, configStore} = props;
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
                return <GridConfig closePanel={closePanel} collection={collection} configStore={configStore}/>
            }, {position: "right"});
            if (result === false) {
                return;
            }

        }}/>

    </div>;
}