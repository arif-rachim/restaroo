import {CSSProperties, ReactElement, useRef} from "react";
import {AppContextProvider} from "./useAppContext";
import {AnimatePresence, motion} from "framer-motion";
import {RouterPageContainer} from "./RouterPageContainer";
import {useStore, Store, useStoreValue} from "./store/useStore";
import {AppState} from "./AppState";
import {GuestProfile} from "../model/Profile";
import {PickerProvider, ShowPickerFunction} from "./page-components/picker/PickerProvider";

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
    background: 'rgba(0,0,0,0.3)',
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
    background: 'rgba(0,0,0,0.3)',
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
    return <motion.div style={slidePanelStyle} initial={{opacity: 0}} animate={{opacity: 1}}
                       exit={{opacity: 0}} transition={{ease: "easeInOut", duration: 0.3}}
                       key={'slider-panel'}>
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
        {slidePanel !== false && <SlidePanel panel={slidePanel}/>}
        {modalPanel !== false && <Modal modalPanel={modalPanel}/>}
    </AnimatePresence>;
}

export default function AppShell() {
    const panelStore = useStore<{ modalPanel: ReactElement | false, slidePanel: ReactElement | false }>({
        modalPanel: false,
        slidePanel: false
    })
    const showPickerRef = useRef<ShowPickerFunction>();
    const store = useStore<AppState>({
        user: GuestProfile
    });

    return <AppContextProvider panelStore={panelStore} store={store} showPickerRef={showPickerRef}>
        <div style={shellStyle}>
            <RouterPageContainer/>
            <SlideAndModalPanel panelStore={panelStore}/>
        </div>
        <PickerProvider ref={instance => showPickerRef.current = instance?.showPicker}/>
    </AppContextProvider>
}
