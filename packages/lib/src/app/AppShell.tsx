import {CSSProperties, ReactElement, useEffect, useRef} from "react";
import {AppContextProvider, FactoryFunctionConfig} from "./useAppContext";
import {AnimatePresence, motion} from "framer-motion";

import {
    FetchService,
    getProp,
    isNullOrUndefined,
    Store,
    useStore,
    useStoreListener,
    useStoreValue
} from "../components/utils";
import {PickerProvider, ShowPickerFunction} from "../components/input";
import {RouterPageContainer, Routes} from "../components/route";
import {BaseState} from "./BaseState";
import {GuestProfile, Profile} from "./profile";
import produce from "immer";
import {Address} from "./address";
import PocketBase from "pocketbase";

const shellStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    overflow: 'auto'

}



function useAppStoreInitialization<T extends BaseState>(initializer: T, pocketBase: PocketBase) {
    const store = useStore<T>(initializer);
    useEffect(() => {
        (async () => {
            let user = GuestProfile;
            let addresses: Address[] = [];
            const token = getProp(pocketBase, 'authStore', 'token');
            const hasToken = !isNullOrUndefined(getProp(pocketBase, 'authStore', 'token'));
            if (hasToken) {
                const authData = await pocketBase.collection('users').authRefresh();
                if (!authData.record) {
                    return;
                }
                user = {
                    id: authData.record.id,
                    emailVisibility: authData.record.emailVisibility,
                    email: authData.record.email,
                    verified: authData.record.verified,
                    created: new Date(authData.record.created),
                    updated: new Date(authData.record.updated),
                    name: authData.record.name,
                    username: authData.record.username,
                    avatar: authData.record.avatar
                }
                let result = await pocketBase.collection('address').getList(1, 50, {
                    filter: `user="${user.id}"`
                });
                addresses = result.items.map((item: any) => ({
                    location: item.location,
                    areaOrStreetName: item.areaOrStreetName,
                    buildingOrPremiseName: item.buildingOrPremiseName,
                    id: item.id,
                    lng: item.lng,
                    lat: item.lat,
                    defaultAddress: false,
                    houseOrFlatNo: item.houseOrFlatNo,
                    landmark: item.landmark
                }));
            }

            store.set(produce((s: BaseState) => {
                s.addresses = addresses;
                s.user = user;
            }))
        })();
    }, [store])
    return store;
}

export default function AppShell<T extends BaseState>(props: { initValue: T, onProfileChange: (next: Profile, prev: (Profile | undefined), store: Store<T>) => void, pocketBase: PocketBase, fetchService: FetchService, routes: Routes }) {
    const panelStore = useStore<{ modalPanel: ReactElement | false, slidePanel: ({ id: string, element: ReactElement, config: FactoryFunctionConfig })[] }>({
        modalPanel: false,
        slidePanel: []
    })
    const showPickerRef = useRef<ShowPickerFunction>();
    const store = useAppStoreInitialization<T>(props.initValue, props.pocketBase);
    useStoreListener(store, s => s.user, (next, prev) => props.onProfileChange(next, prev, store));
    return <AppContextProvider panelStore={panelStore} store={store} showPickerRef={showPickerRef}
                               pocketBase={props.pocketBase} fetchService={props.fetchService}>
        <div style={shellStyle}>
            <RouterPageContainer routes={props.routes} panelStore={panelStore}/>

        </div>
        <PickerProvider ref={instance => showPickerRef.current = getProp(instance, 'showPicker')}/>
    </AppContextProvider>
}
