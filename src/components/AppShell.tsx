import {CSSProperties, ReactElement, useEffect, useRef} from "react";
import {AppContextProvider} from "./useAppContext";
import {AnimatePresence, motion} from "framer-motion";
import {RouterPageContainer} from "./RouterPageContainer";
import {Store, useStore, useStoreValue} from "./store/useStore";
import {AppState} from "./AppState";
import {GuestProfile} from "../model/Profile";
import {PickerProvider, ShowPickerFunction} from "./page-components/picker/PickerProvider";
import produce from "immer";
import {pocketBase} from "./pocketBase";
import {Address} from "../model/Address";

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
            {props?.modalPanel}
        </motion.div>
    </motion.div>;
}


function SlidePanel(props: { panel?: ReactElement }) {
    return <motion.div style={slidePanelStyle}
                       key={'slider-panel'}>
        <motion.div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(5px) contrast(60%)',
            WebkitBackdropFilter: 'blur(5px) contrast(60%)',
        }}
                    initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
        ></motion.div>
        <motion.div style={{position: 'absolute'}} initial={{bottom: '-100%', width: '100%'}}
                    animate={{bottom: 0}} exit={{bottom: '-100%'}} transition={{bounce: 0}}>
            {props?.panel}
        </motion.div>
    </motion.div>;
}

function SlideAndModalPanel(props: { panelStore: Store<{ modalPanel: ReactElement | false; slidePanel: ReactElement | false }> }) {
    const panelStore = props.panelStore;
    const {modalPanel, slidePanel} = useStoreValue(panelStore, param => param);
    return <AnimatePresence>
        {slidePanel !== false && <SlidePanel panel={slidePanel} key={'slide-panel'}/>}
        {modalPanel !== false && <Modal modalPanel={modalPanel} key={'modal-panel'}/>}
    </AnimatePresence>;
}

export default function AppShell() {
    const panelStore = useStore<{ modalPanel: ReactElement | false, slidePanel: ReactElement | false }>({
        modalPanel: false,
        slidePanel: false
    })
    const showPickerRef = useRef<ShowPickerFunction>();
    const store = useStore<AppState>({
        user: GuestProfile,
        addresses: [],
        shoppingCart: []
    });
    useEffect(() => {
        (async () => {
            let user = GuestProfile;
            let addresses:Address[] = [];
            if(pocketBase.authStore.token){
                const authData = await pocketBase.collection('users').authRefresh();
                if(!authData.record){
                    return;
                }
                user = {
                    id : authData.record.id,
                    emailVisibility : authData.record.emailVisibility,
                    email : authData.record.email,
                    verified : authData.record.verified,
                    created : new Date(authData.record.created),
                    updated : new Date(authData.record.updated),
                    name : authData.record.name,
                    username : authData.record.username
                }
                let result = await pocketBase.collection('address').getList(1,50,{
                    filter : `user="${user.id}"`
                });
                addresses = result.items.map(item => ({
                    location : item.location,
                    areaOrStreetName : item.areaOrStreetName,
                    buildingOrPremiseName : item.buildingOrPremiseName,
                    id : item.id,
                    lng : item.lng,
                    lat : item.lat,
                    defaultAddress : false,
                    houseOrFlatNo : item.houseOrFlatNo,
                    landmark : item.landmark
                }));
            }

            store.setState(produce(s => {
                s.addresses = addresses;
                s.user = user;
            }))
        })();

    }, [store])
    return <AppContextProvider panelStore={panelStore} store={store} showPickerRef={showPickerRef}>
        <div style={shellStyle}>
            <RouterPageContainer/>
            <SlideAndModalPanel panelStore={panelStore}/>
        </div>
        <PickerProvider ref={instance => showPickerRef.current = instance?.showPicker}/>
    </AppContextProvider>
}
