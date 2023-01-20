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

const modalStyle: CSSProperties = {
    backdropFilter: 'blur(5px) contrast(60%)',
    WebkitBackdropFilter: 'blur(5px) contrast(60%)',
    width: '100%',
    height: '100%',
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box'
}

const slidePanelStyle: CSSProperties = {

    width: '100%',
    height: '100%',
    position: 'fixed',
    overflow: 'hidden',
    boxSizing: 'border-box'
}
const overlayStyle:CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(5px) contrast(60%)',
    WebkitBackdropFilter: 'blur(5px) contrast(60%)',
}

const overlayStyleNoBlur:CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(0.1px) contrast(60%)',
    WebkitBackdropFilter: 'blur(0.1px) contrast(60%)',
}

const dialogPanelStyle: CSSProperties = {
    minWidth: 100,
    minHeight: 0,
}

function Modal(props: { modalPanel?: ReactElement }) {

    return <motion.div style={modalStyle} initial={{opacity: 0}} animate={{opacity: 1}}
                       exit={{opacity: 0}} transition={{ease: "easeInOut", duration: 0.3}}
                       key={'modal'}>
        <motion.div style={dialogPanelStyle} initial={{scale: 0.7, opacity: 0.4}}
                    animate={{scale: 1, opacity: 1}} exit={{scale: 0.7, opacity: 0.4}}>
            {getProp(props, 'modalPanel')}
        </motion.div>
    </motion.div>;
}


function renderSlidePanels(props: { panels: { id: string, element: ReactElement, config: FactoryFunctionConfig }[] }) {
    const panels = props.panels;
    return panels.map((p,index,source) => {
        let initial:any = {bottom: '-100%', width: '100%'};
        let animate:any = {bottom: 0};
        let exit:any = {bottom: '-100%'};
        if(p.config.position === 'top'){
            initial = {top: '-100%', width: '100%'};
            animate = {top: 0};
            exit = {top:'-100%'};
        }
        if(p.config.position === 'right'){
            initial = {right: '-100%', height: '100%'};
            animate = {right: 0};
            exit = {right:'-100%'};
        }
        if(p.config.position === 'left'){
            initial = {left: '-100%', height: '100%'};
            animate = {left: 0};
            exit = {left:'-100%'};
        }
        const isLastIndex = index === source.length - 1;

        if(!isLastIndex){
            const isNextPanelIsPopup = panels[index + 1].config.isPopup;
            if(!isNextPanelIsPopup){
                animate = exit;
            }
        }
        return <motion.div style={slidePanelStyle}
                           key={p.id}>
            <OverlayPanel blurBackground={!p.config.isPopup} />
            <motion.div style={{position: 'absolute'}} initial={initial}
                        animate={animate} exit={exit} transition={{bounce: 0}}>
                {p.element}
            </motion.div>
        </motion.div>
    })
}
function OverlayPanel(props:{blurBackground:boolean}){

    return <motion.div style={props.blurBackground ? overlayStyle:overlayStyleNoBlur}
                       initial={{opacity: 0}}
                       animate={{opacity: 1}}
                       exit={{opacity: 0}}/>
}

function SlideAndModalPanel(props: { panelStore: Store<{ modalPanel: ReactElement | false, slidePanel: ({ id: string, element: ReactElement, config: FactoryFunctionConfig })[] }> }) {
    const panelStore = props.panelStore;
    const {modalPanel, slidePanel} = useStoreValue(panelStore, param => param);
    return <AnimatePresence>
            {renderSlidePanels({panels:slidePanel})}
            {modalPanel !== false && <Modal modalPanel={modalPanel} key={'modal-panel'}/>}
        </AnimatePresence>
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

export default function AppShell<T extends BaseState>(props: { initValue: T, onProfileChange: (next: Profile, prev: (Profile | undefined), store: Store<T>) => void, pocketBase: PocketBase,fetchService:FetchService, routes: Routes }) {
    const panelStore = useStore<{ modalPanel: ReactElement | false, slidePanel: ({ id: string, element: ReactElement, config: FactoryFunctionConfig })[] }>({
        modalPanel: false,
        slidePanel: []
    })
    const showPickerRef = useRef<ShowPickerFunction>();
    const store = useAppStoreInitialization<T>(props.initValue, props.pocketBase);
    useStoreListener(store, s => s.user, (next, prev) => props.onProfileChange(next, prev, store));
    return <AppContextProvider panelStore={panelStore} store={store} showPickerRef={showPickerRef} pocketBase={props.pocketBase} fetchService={props.fetchService}>
        <div style={shellStyle}>
            <RouterPageContainer routes={props.routes}/>
            <SlideAndModalPanel panelStore={panelStore}/>
        </div>
        <PickerProvider ref={instance => showPickerRef.current = getProp(instance, 'showPicker')}/>
    </AppContextProvider>
}
