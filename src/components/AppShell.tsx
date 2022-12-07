import {CSSProperties, ReactElement, useEffect, useRef} from "react";
import {AppContextProvider} from "./useAppContext";
import {AnimatePresence, motion} from "framer-motion";
import {RouterPageContainer} from "./RouterPageContainer";
import {Store, useStore, useStoreValue} from "./store/useStore";
import {AppState} from "./AppState";
import {GuestProfile} from "../model/Profile";
import {PickerProvider, ShowPickerFunction} from "./page-components/picker/PickerProvider";
import {getProfile} from "../service/getProfile";
import {getAddresses} from "../service/getAddresses";
import produce from "immer";

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
    backdropFilter : 'blur(5px) contrast(60%)',
    WebkitBackdropFilter : 'blur(5px) contrast(60%)',
    width: '100%',
    height: '100%',
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing:'border-box'
}

const slidePanelStyle: CSSProperties = {

    width: '100%',
    height: '100%',
    position: 'fixed',
    overflow:'hidden',
    boxSizing:'border-box'
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
        <motion.div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',backdropFilter : 'blur(5px) contrast(60%)',
            WebkitBackdropFilter : 'blur(5px) contrast(60%)',}}
                    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        ></motion.div>
        <motion.div style={{position:'absolute'}} initial={{bottom: '-100%',width:'100%'}}
                    animate={{bottom: 0}} exit={{bottom: '-100%'}} transition={{bounce:0}}>
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
        addresses : [],
        shoppingCart : []
    });
    useEffect(() => {
        (async () => {
            const [profile,addresses] = await Promise.all([getProfile(),getAddresses()]);
            store.setState(produce(s => {
                s.addresses = addresses;
                s.user = profile;
            }))
        })();

    },[store])
    return <AppContextProvider panelStore={panelStore} store={store} showPickerRef={showPickerRef}>
        <div style={shellStyle}>
            <RouterPageContainer/>
            <SlideAndModalPanel panelStore={panelStore}/>
        </div>
        <PickerProvider ref={instance => showPickerRef.current = instance?.showPicker}/>
    </AppContextProvider>
}
