import {CSSProperties, ReactElement, useState} from "react";
import {AppContextProvider} from "./useAppContext";
import {AnimatePresence, motion} from "framer-motion";
import {RouterPageContainer} from "./RouterPageContainer";
import {useStore} from "./store/useStore";
import {AppState} from "./AppState";
import {GuestProfile} from "../model/Profile";
import {InputModal} from "./page-components/InputModal";

const shellStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    overflow: 'auto',

}

const modalStyle: CSSProperties = {

    backdropFilter: 'blur(5px)',
    background: 'rgba(255,255,255,0.8)',
    width: '100%',
    height: '100%',
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
}

const dialogPanelStyle: CSSProperties = {
    minWidth: 100,
    minHeight: 0,
}

function Modal(props:{modalPanel:ReactElement}) {
    return <motion.div style={modalStyle} initial={{opacity: 0}} animate={{opacity: 1}}
                       exit={{opacity: 0}} transition={{ease: "easeInOut", duration: 0.3}}
                       key={'modal'}>
        <motion.div style={dialogPanelStyle} initial={{scale: 0.7, opacity: 0.4}}
                    animate={{scale: 1, opacity: 1}} exit={{scale: 0.7, opacity: 0.4}}>
            {props.modalPanel}
        </motion.div>
    </motion.div>;
}

export default function AppShell() {
    const [modalPanel, setModalPanel] = useState<ReactElement | false>(false);

    const store = useStore<AppState>({
        user : GuestProfile
    });

    return <AppContextProvider setModalPanel={setModalPanel} store={store}>
        <div style={shellStyle}>
            <RouterPageContainer/>
            <AnimatePresence>
                {modalPanel && <Modal modalPanel={modalPanel} />}
            </AnimatePresence>
        </div>
        <InputModal />
    </AppContextProvider>
}
