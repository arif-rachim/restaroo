import {BaseModel, ListResult, Store, useAppContext, useNavigatePromise} from "@restaroo/lib";
import {ButtonSimple} from "../ButtonSimple";
import { IoCreateOutline, IoSettingsOutline} from "react-icons/io5";
import produce from "immer";
import {border, CollectionRoute} from "./Grid";
import {GridConfig} from "./GridConfig";
import {RouteConfig} from "../useRouteConfig";

export function GridToolbar(props: { collection: string, collectionStore: Store<ListResult<BaseModel>>, routeConfigStore: Store<RouteConfig<CollectionRoute>>, onRouteConfigUpdate: () => void }) {
    const {collection, collectionStore, routeConfigStore, onRouteConfigUpdate} = props;
    const {showSlidePanel} = useAppContext();
    const navigate = useNavigatePromise();
    return <div style={{display: 'flex', borderBottom: border}}>
        <ButtonSimple title={'New'} icon={IoCreateOutline} onClick={async () => {
            const result: BaseModel | false = await navigate('collection-item/product/new');

            if (result === false) {
                return;
            }
            collectionStore.set(produce(s => {
                s.items.push(result);
                s.totalItems = s.totalItems + 1;
            }));
        }}/>


        <ButtonSimple title={''} icon={IoSettingsOutline} onClick={async () => {
            const result: RouteConfig<CollectionRoute> = await showSlidePanel(closePanel => {
                return <GridConfig closePanel={closePanel} collection={collection}
                                   panelConfig={({...routeConfigStore.get()})}/>
            }, {position: "right"});
            routeConfigStore.set(result);
            onRouteConfigUpdate();
        }}/>

    </div>;
}